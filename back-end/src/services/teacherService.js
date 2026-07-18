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

  return {
    classrooms: classrooms.map(c => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      code: c.code,
      section: c.section,
      studentCount: c.enrollments.length,
      assignmentCount: c.assignments?.length || 0,
      progress: Math.min(100, Math.round((c.assignments?.filter(a => a.is_published).length || 0) * 20)),
    })),
    stats: {
      totalClassrooms: classrooms.length,
      totalStudents,
      totalAssignments,
      avgProgress: totalStudents > 0 ? Math.round(classrooms.reduce((s, c) => s + c.enrollments.length * 68, 0) / totalStudents) : 0,
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
      average: Math.round(weightedAvg),
      status: weightedAvg >= 80 ? 'good' : weightedAvg >= 60 ? 'fair' : 'risk',
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

  return { students, topics, stats };
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
  return { id: message.id, content, from: 'teacher', time: 'Ahora' };
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

module.exports = {
  getDashboard, getClasses, getClassDetail, getGrades, updateGrade,
  getMonitorData, getPredictiveData, getTeacherConversations, sendMessage,
  createClass, createAssignment,
};
