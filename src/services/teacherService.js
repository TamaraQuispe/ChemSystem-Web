import api from './api';

export const teacherService = {
  getDashboard: () => api.get('/teacher/dashboard').then(r => r.data),
  getClasses: () => api.get('/teacher/classes').then(r => r.data.classes),
  getClassDetail: (id) => api.get(`/teacher/classes/${id}`).then(r => r.data.classroom),
  getClassroomOverview: (id) => api.get(`/teacher/classes/${id}/overview`).then(r => r.data),
  updateClassroom: (id, data) => api.patch(`/teacher/classes/${id}`, data).then(r => r.data),
  getGrades: (classId) => api.get(`/teacher/classes/${classId}/grades`).then(r => r.data.students),
  updateGrade: (gradeId, score) => api.patch(`/teacher/grades/${gradeId}`, { score }).then(r => r.data.grade),
  getMonitorData: (classId) => api.get(`/teacher/classes/${classId}/monitor`).then(r => r.data),
  getPredictiveData: (classId) => api.get(`/teacher/classes/${classId}/predictive`).then(r => r.data),
  getConversations: () => api.get('/teacher/conversations').then(r => r.data.conversations),
  sendMessage: (conversationId, content) => api.post(`/teacher/conversations/${conversationId}/messages`, { content }).then(r => r.data.message),
  getConversationMessages: (conversationId) => api.get(`/teacher/conversations/${conversationId}/messages`).then(r => r.data.messages),
  createClass: (data) => api.post('/teacher/classes', data).then(r => r.data.classroom),
  publishGrades: (classId) => api.post(`/teacher/classes/${classId}/grades/publish`).then(r => r.data),
  createAssignment: (classId, data) => api.post(`/teacher/classes/${classId}/assignments`, data).then(r => r.data.assignment),
  startConversation: (parentId, studentId, subject) => api.post('/teacher/conversations', { parent_id: parentId, student_id: studentId, subject }).then(r => r.data.conversation),
};
