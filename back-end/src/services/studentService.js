const { Op } = require('sequelize');
const {
  User, UserAnalytics, UserModule, Module, Notification,
  QuizResult, Achievement, Experiment, CommunityPost,
  Prediction, AiRecommendation, Conversation, Message
} = require('../models');

async function getDashboard(userId) {
  const user = await User.findByPk(userId);
  const analytics = await UserAnalytics.findOne({ where: { user_id: userId } });

  const modules = await UserModule.findAll({
    where: { user_id: userId },
    include: [{ model: Module, as: 'module' }],
    order: [['started_at', 'DESC']],
  });

  const notifications = await Notification.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 5,
  });

  const achievements = await Achievement.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
  });

  const currentModule = modules.find(m => m.status === 'in_progress') || modules[0];

  const weeklyXp = generateWeeklyXp();

  const totalXp = (user?.xp || 0) + achievements.reduce((s, a) => s + a.xp_awarded, 0);

  return {
    user: { name: user.name, level: user.level, xp: totalXp, avatar_url: user.avatar_url },
    kpis: {
      avgScore: analytics?.avg_yield || 0,
      experimentsCount: analytics?.total_experiments || 0,
      streak: Math.min(14, achievements.length),
      modulesCompleted: modules.filter(m => m.status === 'completed').length,
    },
    currentModule: currentModule ? {
      title: currentModule.module?.title || 'Módulo',
      progress: currentModule.progress_percent || 0,
      status: currentModule.status,
    } : null,
    weeklyXp,
    recentActivity: notifications.map(n => ({
      type: n.type,
      title: n.title,
      message: n.message,
      time: formatTimeAgo(n.created_at),
    })),
    achievements: achievements.slice(0, 3).map(a => ({
      title: a.title,
      icon: a.icon,
      rarity: a.rarity,
    })),
  };
}

async function getProgress(userId) {
  const modules = await UserModule.findAll({
    where: { user_id: userId },
    include: [{ model: Module, as: 'module' }],
  });

  return modules.map(m => ({
    moduleId: m.module_id,
    title: m.module?.title || 'Módulo',
    progress: m.progress_percent,
    status: m.status,
  }));
}

async function completeLesson(userId, lessonId) {
  const now = new Date();
  let userModule;
  try {
    [userModule] = await UserModule.findOrCreate({
      where: { user_id: userId, module_id: lessonId },
      defaults: { user_id: userId, module_id: lessonId, progress_percent: 100, status: 'completed', started_at: now, completed_at: now },
    });
  } catch {
    userModule = await UserModule.create({
      user_id: userId, module_id: lessonId, progress_percent: 100,
      status: 'completed', started_at: now, completed_at: now,
    });
  }
  if (userModule.status !== 'completed') {
    userModule.progress_percent = 100;
    userModule.status = 'completed';
    userModule.completed_at = now;
    await userModule.save();
  }
  return userModule;
}

async function completeQuiz(userId, data) {
  const result = await QuizResult.create({
    user_id: userId,
    module_id: data.module_id || null,
    score: data.score,
    max_score: data.max_score || 100,
    xp_earned: data.xp_earned || 0,
    answers: data.answers || [],
    time_spent_seconds: data.time_spent_seconds || 0,
  });

  if (data.xp_earned) {
    await User.increment('xp', { by: data.xp_earned, where: { id: userId } });
  }

  try {
    const { Enrollment, Classroom, FamilyRelationship, sequelize } = require('../models');
    const enrollments = await Enrollment.findAll({
      where: { student_id: userId },
      include: [{ model: Classroom, as: 'classroom', attributes: ['teacher_id', 'name'] }],
    });
    const notified = new Set();
    for (const enr of enrollments) {
      if (enr.classroom?.teacher_id && !notified.has(enr.classroom.teacher_id)) {
        notified.add(enr.classroom.teacher_id);
        await Notification.create({
          user_id: enr.classroom.teacher_id,
          title: `Práctica completada: ${Math.round((data.score / (data.max_score || 100)) * 100)}%`,
          message: `${data.answers?.length || 0} respuestas enviadas en ${enr.classroom.name || 'curso'}`,
          type: 'achievement',
        });
      }
    }
    // Notify parents
    const families = await FamilyRelationship.findAll({ where: { student_id: userId } });
    const user_ = await User.findByPk(userId, { attributes: ['name'] });
    for (const fam of families) {
      await Notification.create({
        user_id: fam.parent_id,
        title: `${user_?.name || 'Tu hijo'} completó una práctica`,
        message: `Obtuvo ${Math.round((data.score / (data.max_score || 100)) * 100)}% en su última evaluación`,
        type: 'achievement',
      });
    }
  } catch {}

  return result;
}

async function getQuizHistory(userId) {
  return QuizResult.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 20,
  });
}

async function getAchievements(userId) {
  return Achievement.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
  });
}

async function createAchievement(userId, data) {
  return Achievement.create({
    user_id: userId,
    title: data.title,
    description: data.description || '',
    icon: data.icon || 'trophy',
    rarity: data.rarity || 'common',
    xp_awarded: data.xp_awarded || 50,
  });
}

async function updateProfile(userId, data) {
  const updateFields = {};
  if (data.name) updateFields.name = data.name;
  if (data.avatar_url) updateFields.avatar_url = data.avatar_url;
  if (Object.keys(updateFields).length > 0) {
    await User.update(updateFields, { where: { id: userId } });
  }
  return User.findByPk(userId);
}

async function getConversations(userId) {
  const conversations = await Conversation.findAll({
    where: { student_id: userId },
    include: [
      { model: User, as: 'teacher', attributes: ['id', 'name', 'avatar_url'] },
      { model: User, as: 'parent', attributes: ['id', 'name'] },
      { model: Message, as: 'messages', separate: true, limit: 1, order: [['created_at', 'DESC']] },
    ],
    order: [['last_message_at', 'DESC']],
  });
  const results = [];
  for (const c of conversations) {
    const unread = await Message.count({
      where: { conversation_id: c.id, is_read: false, sender_id: { [Op.ne]: userId } },
    });
    const lastMsg = c.messages?.[0];
    results.push({
      id: c.id,
      teacher: { id: c.teacher.id, name: c.teacher.name, avatar: c.teacher.avatar_url },
      parent: c.parent ? { id: c.parent.id, name: c.parent.name } : null,
      subject: c.subject,
      lastMessage: lastMsg ? { content: lastMsg.content, time: formatTimeAgo(lastMsg.created_at) } : null,
      unread,
    });
  }
  return results;
}

async function getConversationMessages(conversationId, userId) {
  const conversation = await Conversation.findByPk(conversationId, { attributes: ['student_id'] });
  if (!conversation) { const e = new Error('Conversación no encontrada'); e.status = 404; throw e; }
  if (conversation.student_id !== userId) { const e = new Error('No autorizado'); e.status = 403; throw e; }
  await Message.update({ is_read: true }, { where: { conversation_id: conversationId, sender_id: { [Op.ne]: userId }, is_read: false } });
  const messages = await Message.findAll({
    where: { conversation_id: conversationId },
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
    order: [['created_at', 'ASC']],
  });
  return messages.map(m => ({
    id: m.id,
    from: m.sender.role,
    senderName: m.sender.name,
    text: m.content,
    time: formatTimeAgo(m.created_at),
    createdAt: m.created_at,
    is_read: m.is_read,
  }));
}

async function sendMessage(userId, conversationId, content) {
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) { const e = new Error('Conversación no encontrada'); e.status = 404; throw e; }
  if (conversation.student_id !== userId) { const e = new Error('No autorizado'); e.status = 403; throw e; }
  const message = await Message.create({
    conversation_id: conversationId,
    sender_id: userId,
    content,
  });
  conversation.last_message_at = new Date();
  await conversation.save();
  try {
    await Notification.create({
      user_id: conversation.teacher_id,
      title: 'Nuevo mensaje del estudiante',
      message: content.substring(0, 120) + (content.length > 120 ? '...' : ''),
      type: 'info',
    });
    await Notification.create({
      user_id: conversation.parent_id,
      title: 'Nuevo mensaje del estudiante',
      message: content.substring(0, 120) + (content.length > 120 ? '...' : ''),
      type: 'info',
    });
  } catch {}
  return { id: message.id, content, from: 'student', time: 'Ahora' };
}

function generateWeeklyXp() {
  return [
    { day: 'L', xp: 55 }, { day: 'M', xp: 85 },
    { day: 'X', xp: 35 }, { day: 'J', xp: 75 },
    { day: 'V', xp: 90 }, { day: 'S', xp: 45 },
    { day: 'D', xp: 65 },
  ];
}

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  return new Date(date).toLocaleDateString('es', { day: '2-digit', month: 'short' });
}

module.exports = {
  getDashboard, getProgress, completeLesson, completeQuiz,
  getQuizHistory, getAchievements, createAchievement, updateProfile,
  getConversations, getConversationMessages, sendMessage,
};
