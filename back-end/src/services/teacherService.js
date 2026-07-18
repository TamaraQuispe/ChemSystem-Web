const { Op } = require('sequelize');
const {
  User, Classroom, Enrollment, Grade, Assignment,
  Conversation, Message, Notification, UserModule, Module
} = require('../models');

async function getDashboard(teacherId) {
  const classrooms = await Classroom.findAll({
    where: { teacher_id: teacherId },
    include: [
      { model: Enrollment, as: 'enrollments', include: [{ model: User, as: 'student', attributes: ['id', 'name'] }] },
      { model: Assignment, as: 'assignments', where: { is_published: true }, required: false },
    ],
  });

  const totalStudents = classrooms.reduce((s, c) => s + c.enrollments.length, 0);
  const totalAssignments = classrooms.reduce((s, c) => s + (c.assignments?.length || 0), 0);

  const activity = await Notification.findAll({
    where: { user_id: teacherId },
    order: [['created_at', 'DESC']],
    limit: 5,
  });

  const totalEnrollments = classrooms.reduce((s, c) => s + c.enrollments.length, 0);
  const avgProgress = totalEnrollments > 0
    ? Math.round(classrooms.reduce((s, c) => s + c.enrollments.reduce((s2, e) => s2 + Math.min(100, (e.student?.level || 1) * 8), 0), 0) / totalEnrollments)
    : 0;

  return {
    classrooms: classrooms.map(c => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      code: c.code,
      section: c.section,
      studentCount: c.enrollments.length,
      assignmentCount: c.assignments?.length || 0,
      progress: Math.min(100, c.enrollments.length > 0 ? Math.round(c.enrollments.reduce((s, e) => s + (e.student?.level || 1) * 8, 0) / c.enrollments.length) : 0),
    })),
    stats: {
      totalClassrooms: classrooms.length,
      totalStudents,
      totalAssignments,
      avgProgress,
    },
    activity: activity.map(n => ({
      type: n.type,
      title: n.title,
      message: n.message,
      time: formatTimeAgo(n.created_at),
    })),
  };
}

async function getClasses(teacherId) {
  return Classroom.findAll({
    where: { teacher_id: teacherId },
    include: [{ model: Enrollment, as: 'enrollments' }],
    order: [['created_at', 'DESC']],
  });
}

async function getClassDetail(classroomId) {
  const classroom = await Classroom.findByPk(classroomId, {
    include: [
      { model: Enrollment, as: 'enrollments', include: [{ model: User, as: 'student', attributes: ['id', 'name', 'email', 'avatar_url', 'level'] }] },
      { model: Assignment, as: 'assignments' },
    ],
  });
  if (!classroom) throw new Error('Aula no encontrada');
  return classroom;
}

async function getGrades(classroomId) {
  const enrollments = await Enrollment.findAll({
    where: { classroom_id: classroomId },
    include: [
      { model: User, as: 'student', attributes: ['id', 'name', 'email', 'avatar_url'] },
      { model: Grade, as: 'grades' },
    ],
  });

  return enrollments.map(e => {
    const grades = e.grades || [];
    const taskGrades = grades.filter(g => g.type === 'task');
    const labGrades = grades.filter(g => g.type === 'lab');
    const examGrades = grades.filter(g => g.type === 'exam');
    const avgTask = taskGrades.length ? avg(taskGrades.map(g => (g.score / g.max_score) * 100)) : 0;
    const avgLab = labGrades.length ? avg(labGrades.map(g => (g.score / g.max_score) * 100)) : 0;
    const avgExam = examGrades.length ? avg(examGrades.map(g => (g.score / g.max_score) * 100)) : 0;
    const weightedAvg = (avgTask * 0.2) + (avgLab * 0.3) + (avgExam * 0.5);

    return {
      id: e.student.id,
      name: e.student.name,
      email: e.student.email,
      avatar: e.student.avatar_url,
      gradeRecords: grades.map(g => ({
        id: g.id,
        type: g.type,
        score: Number(g.score),
        maxScore: Number(g.max_score),
        topic: g.topic,
      })),
      tasks: Math.round(avgTask),
      lab3d: Math.round(avgLab),
      exam: Math.round(avgExam),
      average: grades.length > 0 ? Math.round(weightedAvg) : null,
      status: grades.length === 0 ? 'no_data' : weightedAvg >= 80 ? 'good' : weightedAvg >= 60 ? 'fair' : 'risk',
    };
  });
}

async function updateGrade(gradeId, score) {
  const grade = await Grade.findByPk(gradeId);
  if (!grade) throw new Error('Calificación no encontrada');
  grade.score = score;
  await grade.save();
  return grade;
}

async function getMonitorData(classroomId) {
  const enrollments = await Enrollment.findAll({
    where: { classroom_id: classroomId },
    include: [
      { model: User, as: 'student', attributes: ['id', 'name', 'avatar_url'] },
      { model: Grade, as: 'grades' },
    ],
  });

  const topicPerformance = {};
  const students = enrollments.map(e => {
    const grades = e.grades || [];
    const studentAvg = grades.length ? avg(grades.map(g => (g.score / g.max_score) * 100)) : 0;
    (grades).forEach(g => {
      const topic = g.topic || 'General';
      if (!topicPerformance[topic]) topicPerformance[topic] = { scores: [], count: 0 };
      topicPerformance[topic].scores.push((g.score / g.max_score) * 100);
      topicPerformance[topic].count++;
    });
    return {
      id: e.student.id,
      name: e.student.name,
      avatar: e.student.avatar_url,
      average: Math.round(studentAvg),
      status: studentAvg >= 80 ? 'excellent' : studentAvg >= 60 ? 'good' : 'risk',
    };
  });

  const topics = Object.entries(topicPerformance).map(([topic, data]) => ({
    topic,
    avgScore: Math.round(avg(data.scores)),
    studentsCount: data.count,
    status: avg(data.scores) >= 80 ? 'strong' : avg(data.scores) >= 60 ? 'moderate' : 'weak',
  }));

  const stats = {
    excellent: students.filter(s => s.status === 'excellent').length,
    good: students.filter(s => s.status === 'good').length,
    risk: students.filter(s => s.status === 'risk').length,
  };

  const overallAvg = students.length ? Math.round(students.reduce((s, st) => s + st.average, 0) / students.length) : 0;
  const progressData = Array.from({ length: 6 }, (_, i) => ({
    name: `SEM ${i + 1}`,
    value: Math.max(10, Math.min(98, overallAvg - 30 + i * 12 + Math.floor(Math.random() * 8))),
  }));

  return { students, topics, stats, progressData };
}

async function getPredictiveData(classroomId) {
  const enrollments = await Enrollment.findAll({
    where: { classroom_id: classroomId },
    include: [
      { model: User, as: 'student', attributes: ['id', 'name', 'avatar_url', 'level'] },
      { model: Grade, as: 'grades' },
    ],
  });

  const atRisk = [];
  const suggestions = [];

  enrollments.forEach(e => {
    const grades = e.grades || [];
    const avgScore = grades.length ? avg(grades.map(g => (g.score / g.max_score) * 100)) : 0;
    const recentGrades = grades.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    const trend = recentGrades.length >= 2
      ? (recentGrades[0].score / recentGrades[0].max_score) - (recentGrades[recentGrades.length - 1].score / recentGrades[recentGrades.length - 1].max_score)
      : 0;

    if (avgScore < 60 || trend < -0.1) {
      atRisk.push({
        id: e.student.id,
        name: e.student.name,
        avatar: e.student.avatar_url,
        average: Math.round(avgScore),
        trend: Math.round(trend * 100),
        riskLevel: avgScore < 50 ? 'high' : 'medium',
        suggestions: avgScore < 50
          ? ['Programar tutoría personalizada', 'Asignar ejercicios de refuerzo', 'Notificar al padre']
          : ['Ejercicios adicionales', 'Monitoreo semanal'],
      });
    }
  });

  if (atRisk.length > 0) {
    suggestions.push({ type: 'warning', message: `${atRisk.length} estudiante(s) requieren atención inmediata.` });
  }
  suggestions.push({ type: 'tip', message: 'Los simuladores interactivos mejoran la retención en un 40%.' });
  if (enrollments.some(e => (e.grades || []).length < 3)) {
    suggestions.push({ type: 'tip', message: 'Completa las calificaciones pendientes para mejorar el análisis predictivo.' });
  }

  return { atRisk, suggestions, totalStudents: enrollments.length, atRiskCount: atRisk.length };
}

async function getTeacherConversations(teacherId) {
  const conversations = await Conversation.findAll({
    where: { teacher_id: teacherId },
    include: [
      { model: User, as: 'parent', attributes: ['id', 'name', 'avatar_url'] },
      { model: User, as: 'student', attributes: ['id', 'name'] },
      { model: Message, as: 'messages', separate: true, limit: 1, order: [['created_at', 'DESC']] },
    ],
    order: [['last_message_at', 'DESC']],
  });

  return conversations.map(c => ({
    id: c.id,
    parent: { id: c.parent.id, name: c.parent.name, avatar: c.parent.avatar_url },
    student: c.student ? { id: c.student.id, name: c.student.name } : null,
    subject: c.subject,
    lastMessage: c.messages?.[0] ? { content: c.messages[0].content, time: formatTimeAgo(c.messages[0].created_at) } : null,
  }));
}

async function sendMessage(teacherId, conversationId, content) {
  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation || conversation.teacher_id !== teacherId) throw new Error('No autorizado');
  const message = await Message.create({ conversation_id: conversationId, sender_id: teacherId, content });
  conversation.last_message_at = new Date();
  await conversation.save();
  try {
    await Notification.create({
      user_id: conversation.parent_id,
      title: 'Nuevo mensaje del docente',
      message: content.substring(0, 120) + (content.length > 120 ? '...' : ''),
      type: 'info',
    });
  } catch {}
  return { id: message.id, content, from: 'teacher', time: 'Ahora' };
}

async function getConversationMessages(conversationId) {
  const messages = await Message.findAll({
    where: { conversation_id: conversationId },
    include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }],
    order: [['created_at', 'ASC']],
  });
  return messages.map(m => ({
    id: m.id,
    from: m.sender.role === 'teacher' ? 'teacher' : m.sender.role === 'student' ? 'student' : 'parent',
    text: m.content,
    time: formatTimeAgo(m.created_at),
  }));
}

function avg(arr) {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
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

async function createClass(teacherId, data) {
  const count = await Classroom.count({ where: { teacher_id: teacherId } });
  const code = `${data.subject.substring(0, 2).toUpperCase()}-${String(count + 1).padStart(3, '0')}`;
  const classroom = await Classroom.create({
    teacher_id: teacherId,
    name: data.name,
    subject: data.subject,
    code,
    section: data.section || 'A',
    academic_period: data.academic_period || '2026-1',
  });
  return classroom;
}

async function createAssignment(classroomId, data) {
  const assignment = await Assignment.create({
    classroom_id: classroomId,
    title: data.title,
    description: data.description || '',
    type: data.type || 'task',
    due_date: data.due_date || null,
    max_score: data.max_score || 100,
  });
  return assignment;
}

async function publishGrades(classroomId) {
  const enrollments = await Enrollment.findAll({
    where: { classroom_id: classroomId },
    include: [{ model: User, as: 'student', attributes: ['id', 'name'] }],
  });
  const enrollmentIds = enrollments.map(e => e.id);
  const [updated] = await Grade.update(
    { is_published: true, published_at: new Date() },
    { where: { enrollment_id: enrollmentIds, is_published: false } }
  );
  const studentNotifs = enrollments.map(e => ({
    user_id: e.student.id,
    title: 'Notas publicadas',
    message: 'Tus calificaciones han sido publicadas por el docente. Revisa tu panel de rendimiento.',
    type: 'achievement',
  }));

  // Notify parents
  const { FamilyRelationship } = require('../models');
  for (const e of enrollments) {
    const families = await FamilyRelationship.findAll({ where: { student_id: e.student.id } });
    for (const fam of families) {
      studentNotifs.push({
        user_id: fam.parent_id,
        title: `Notas publicadas: ${e.student.name}`,
        message: `Las calificaciones de ${e.student.name} ya están disponibles en tu panel familiar.`,
        type: 'achievement',
      });
    }
  }

  await Notification.bulkCreate(studentNotifs);
  return { gradesPublished: updated, studentsNotified: enrollments.length, parentsNotified: studentNotifs.length - enrollments.length };
}

async function updateClassroom(teacherId, classroomId, data) {
  const classroom = await Classroom.findOne({ where: { id: classroomId, teacher_id: teacherId } });
  if (!classroom) throw new Error('Aula no encontrada');
  const updates = {};
  if (data.name) updates.name = data.name;
  if (data.subject) updates.subject = data.subject;
  if (data.section) updates.section = data.section;
  await classroom.update(updates);
  return classroom;
}

async function getClassroomOverview(teacherId, classroomId) {
  const classroom = await Classroom.findOne({
    where: { id: classroomId, teacher_id: teacherId },
    include: [
      { model: Enrollment, as: 'enrollments', include: [{ model: User, as: 'student', attributes: ['id', 'name', 'avatar_url', 'level'] }] },
      { model: Assignment, as: 'assignments' },
    ],
  });
  if (!classroom) throw new Error('Aula no encontrada');

  const gradesCount = await Grade.count({
    include: [{ model: Enrollment, as: 'enrollment', where: { classroom_id: classroomId } }],
  });

  const enrollments = await Enrollment.findAll({
    where: { classroom_id: classroomId },
    include: [{ model: Grade, as: 'grades' }],
  });
  const atRisk = enrollments.filter(e => {
    const grades = e.grades || [];
    const avg = grades.length ? grades.reduce((s, g) => s + (g.score / g.max_score) * 100, 0) / grades.length : 0;
    return avg < 60;
  }).length;

  return {
    id: classroom.id,
    name: classroom.name,
    subject: classroom.subject,
    code: classroom.code,
    section: classroom.section,
    studentCount: classroom.enrollments.length,
    assignmentCount: classroom.assignments?.length || 0,
    gradesCount,
    atRiskCount: atRisk,
    created_at: classroom.created_at,
  };
}

module.exports = {
  getDashboard, getClasses, getClassDetail, getGrades, updateGrade,
  getMonitorData, getPredictiveData, getTeacherConversations, sendMessage,
  getConversationMessages, createClass, createAssignment, publishGrades,
  updateClassroom, getClassroomOverview,
};
