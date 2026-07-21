const { Op } = require('sequelize');
const {
  FamilyRelationship, User, UserAnalytics, Notification,
  Module, UserModule, AiRecommendation,
  Conversation, Message,
} = require('../models');

async function getChildren(parentId) {
  const relations = await FamilyRelationship.findAll({
    where: { parent_id: parentId },
    attributes: [],
    include: [{
      model: User,
      as: 'student',
      attributes: ['id', 'name', 'email', 'avatar_url', 'level', 'xp', 'role'],
    }],
  });
  return relations.map(r => r.student);
}

async function getDashboard(parentId, studentId) {
  const student = await User.findByPk(studentId);
  if (!student) throw new Error('Estudiante no encontrado');

  const analytics = await UserAnalytics.findOne({ where: { user_id: studentId } });

  const modules = await UserModule.findAll({
    where: { user_id: studentId },
    include: [{ model: Module, as: 'module' }],
  });

  const recentNotifications = await Notification.findAll({
    where: { user_id: studentId },
    order: [['created_at', 'DESC']],
    limit: 5,
  });

  const recommendations = await AiRecommendation.findAll({
    order: [['priority', 'ASC']],
    limit: 3,
  });

  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.status === 'completed').length;
  const avgProgress = modules.length
    ? Math.round(modules.reduce((s, m) => s + m.progress_percent, 0) / modules.length)
    : 0;

  return {
    student: { id: student.id, name: student.name, avatar_url: student.avatar_url, level: student.level, xp: student.xp },
    kpis: {
      avgScore: analytics?.avg_yield || avgProgress,
      studyTime: analytics?.total_experiments || 0,
      challengesCompleted: `${completedModules}/${totalModules}`,
      streak: student.level || 0,
    },
    weeklyEvolution: generateWeeklyData(studentId),
    subjectProgress: modules.map(m => ({
      subject: m.module?.title || 'Módulo',
      progress: m.progress_percent,
      status: m.progress_percent >= 80 ? 'excelente' : m.progress_percent >= 60 ? 'bueno' : 'atencion',
    })),
    recentActivity: recentNotifications.map(n => ({
      type: n.type,
      label: n.title,
      message: n.message,
      time: formatTimeAgo(n.created_at),
    })),
    recommendations: recommendations.map(r => ({
      type: r.type,
      title: r.type === 'warning' ? 'Atención' : r.type === 'success' ? 'Fortaleza' : 'Recomendación',
      message: r.message,
      priority: r.priority,
    })),
  };
}

async function getAlerts(parentId, studentId, filters = {}) {
  const where = { user_id: studentId };
  if (filters.type && filters.type !== 'all') where.type = filters.type;

  const notifications = await Notification.findAll({
    where,
    order: [['created_at', 'DESC']],
  });

  return notifications.map(n => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    time: formatTimeAgo(n.created_at),
    severity: n.type === 'alert' || n.type === 'urgent' ? 'high' : n.type === 'info' ? 'low' : 'medium',
    read: n.is_read,
  }));
}

async function markAlertRead(alertId) {
  const notification = await Notification.findByPk(alertId);
  if (!notification) throw new Error('Alerta no encontrada');
  notification.is_read = true;
  await notification.save();
  return { success: true };
}

async function getRecommendations(parentId, studentId) {
  const recommendations = await AiRecommendation.findAll({
    order: [['priority', 'ASC']],
  });

  return recommendations.map(r => ({
    id: r.id,
    type: r.type,
    message: r.message,
    priority: r.priority,
    priorityLabel: r.priority === 1 ? 'high' : r.priority === 2 ? 'medium' : 'low',
  }));
}

async function getAchievements(parentId, studentId) {
  const modules = await UserModule.findAll({
    where: { user_id: studentId },
    include: [{ model: Module, as: 'module' }],
  });

  return modules
    .filter(m => m.status === 'completed')
    .map(m => ({
      title: m.module?.title || 'Módulo completado',
      desc: `Completaste el módulo con ${m.progress_percent}% de progreso`,
      date: m.completed_at || m.started_at,
      rarity: m.progress_percent >= 90 ? 'legendary' : m.progress_percent >= 75 ? 'epic' : 'rare',
      xp: Math.round(m.progress_percent * 2),
    }));
}

function generateWeeklyData(studentId) {
  return [
    { week: 'Sem 1', General: 72, Organica: 65, Termodinamica: 58, Cinetica: 70, Acidos: 68 },
    { week: 'Sem 2', General: 75, Organica: 68, Termodinamica: 55, Cinetica: 73, Acidos: 65 },
    { week: 'Sem 3', General: 80, Organica: 72, Termodinamica: 52, Cinetica: 78, Acidos: 62 },
    { week: 'Sem 4', General: 85, Organica: 75, Termodinamica: 54, Cinetica: 82, Acidos: 60 },
    { week: 'Sem 5', General: 88, Organica: 78, Termodinamica: 56, Cinetica: 86, Acidos: 61 },
    { week: 'Sem 6', General: 92, Organica: 78, Termodinamica: 55, Cinetica: 88, Acidos: 62 },
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

async function getUnreadCount(parentId) {
  const count = await Notification.count({
    where: { user_id: parentId, is_read: false },
  });
  return count;
}

async function getConversations(parentId) {
  const conversations = await Conversation.findAll({
    where: { parent_id: parentId },
    include: [
      { model: User, as: 'teacher', attributes: ['id', 'name', 'avatar_url'] },
      { model: User, as: 'student', attributes: ['id', 'name'] },
      { model: Message, as: 'messages', separate: true, limit: 1, order: [['created_at', 'DESC']] },
    ],
    order: [['last_message_at', 'DESC']],
  });

  const results = [];
  for (const c of conversations) {
    const unread = await Message.count({
      where: { conversation_id: c.id, is_read: false, sender_id: { [Op.ne]: parentId } },
    });
    const lastMsg = c.messages?.[0];
    results.push({
      id: c.id,
      teacher: { id: c.teacher.id, name: c.teacher.name, avatar: c.teacher.avatar_url },
      student: c.student ? { id: c.student.id, name: c.student.name } : null,
      subject: c.subject,
      lastMessage: lastMsg ? { content: lastMsg.content, time: formatTimeAgo(lastMsg.created_at) } : null,
      unread,
    });
  }
  return results;
}

async function getConversationMessages(conversationId, parentId) {
  const conversation = await Conversation.findByPk(conversationId, { attributes: ['parent_id'] });
  if (!conversation) { const e = new Error('Conversación no encontrada'); e.status = 404; throw e; }
  if (conversation.parent_id !== parentId) { const e = new Error('No autorizado'); e.status = 403; throw e; }
  await Message.update({ is_read: true }, { where: { conversation_id: conversationId, sender_id: { [Op.ne]: parentId }, is_read: false } });
  const messages = await Message.findAll({
    where: { conversation_id: conversationId },
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
    order: [['created_at', 'ASC']],
  });
  return messages.map(m => ({
    id: m.id,
    from: m.sender.role === 'parent' ? 'parent' : m.sender.role === 'student' ? 'student' : 'teacher',
    text: m.content,
    time: formatTimeAgo(m.created_at),
    is_read: m.is_read,
  }));
}

async function sendMessage(parentId, conversationId, content) {
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) { const e = new Error('Conversación no encontrada'); e.status = 404; throw e; }
  if (conversation.parent_id !== parentId) { const e = new Error('No autorizado'); e.status = 403; throw e; }

  const message = await Message.create({
    conversation_id: conversationId,
    sender_id: parentId,
    content,
  });

  conversation.last_message_at = new Date();
  await conversation.save();

  try {
    await Notification.create({
      user_id: conversation.teacher_id,
      title: 'Nuevo mensaje de padre de familia',
      message: content.substring(0, 120) + (content.length > 120 ? '...' : ''),
      type: 'info',
    });
    if (conversation.student_id) {
      await Notification.create({
        user_id: conversation.student_id,
        title: 'Tu padre/madre ha enviado un mensaje',
        message: 'Revisa la sección de Colaboración Tripartita para ver el mensaje.',
        type: 'info',
      });
    }
  } catch {}

  return { id: message.id, content, from: 'parent', time: 'Ahora' };
}

async function getTeachers(parentId) {
  const teachers = await User.findAll({
    where: { role: 'teacher' },
    attributes: ['id', 'name', 'email', 'avatar_url'],
  });
  return teachers.map(t => ({
    id: t.id,
    name: t.name,
    email: t.email,
    avatar: t.avatar_url,
  }));
}

async function startConversation(parentId, teacherId, studentId, subject) {
  if (studentId) {
    const relation = await FamilyRelationship.findOne({
      where: { parent_id: parentId, student_id: studentId },
    });
    if (!relation) { const e = new Error('El estudiante no está vinculado a este padre/madre'); e.status = 403; throw e; }
  }
  const [conversation] = await Conversation.findOrCreate({
    where: { parent_id: parentId, teacher_id: teacherId, student_id: studentId || null },
    defaults: { parent_id: parentId, teacher_id: teacherId, student_id: studentId || null, subject: subject || 'Consulta General' },
  });
  return conversation;
}

module.exports = {
  getChildren, getDashboard, getAlerts, markAlertRead,
  getRecommendations, getAchievements,
  getUnreadCount, getConversations, getConversationMessages,
  sendMessage, getTeachers, startConversation,
};
