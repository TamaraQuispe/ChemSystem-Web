import api from './api';

export const studentService = {
  getDashboard: () => api.get('/student/dashboard').then(r => r.data),
  getProgress: () => api.get('/student/progress').then(r => r.data),
  completeLesson: (lessonId) => api.post(`/student/lessons/${lessonId}/complete`).then(r => r.data.module),
  completeQuiz: (data) => api.post('/student/quiz/complete', data).then(r => r.data.quizResult),
  getQuizHistory: () => api.get('/student/quiz/history').then(r => r.data.results),
  getAchievements: () => api.get('/student/achievements').then(r => r.data.achievements),
  createAchievement: (data) => api.post('/student/achievements', data).then(r => r.data.achievement),
  updateProfile: (data) => api.patch('/student/profile', data).then(r => r.data.user),
  getGrades: () => api.get('/student/grades').then(r => r.data.grades),
  getAssignments: () => api.get('/student/assignments').then(r => r.data.assignments),
  getConversations: () => api.get('/student/conversations').then(r => r.data.conversations),
  getConversationMessages: (conversationId) => api.get(`/student/conversations/${conversationId}/messages`).then(r => r.data.messages),
  sendMessage: (conversationId, content) => api.post(`/student/conversations/${conversationId}/messages`, { content }).then(r => r.data.message),
};
