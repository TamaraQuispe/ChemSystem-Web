import api from './api';

export const teacherService = {
  getDashboard: () => api.get('/teacher/dashboard').then(r => r.data),
  getClasses: () => api.get('/teacher/classes').then(r => r.data.classes),
  getClassDetail: (id) => api.get(`/teacher/classes/${id}`).then(r => r.data.classroom),
  getGrades: (classId) => api.get(`/teacher/classes/${classId}/grades`).then(r => r.data.students),
  updateGrade: (gradeId, score) => api.patch(`/teacher/grades/${gradeId}`, { score }).then(r => r.data.grade),
  getMonitorData: (classId) => api.get(`/teacher/classes/${classId}/monitor`).then(r => r.data),
  getPredictiveData: (classId) => api.get(`/teacher/classes/${classId}/predictive`).then(r => r.data),
  getConversations: () => api.get('/teacher/conversations').then(r => r.data.conversations),
  sendMessage: (conversationId, content) => api.post(`/teacher/conversations/${conversationId}/messages`, { content }).then(r => r.data.message),
  createClass: (data) => api.post('/teacher/classes', data).then(r => r.data.classroom),
  createAssignment: (classId, data) => api.post(`/teacher/classes/${classId}/assignments`, data).then(r => r.data.assignment),
};
