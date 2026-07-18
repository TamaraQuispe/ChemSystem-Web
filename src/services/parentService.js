import api from './api';

export const parentService = {
  getChildren: () => api.get('/parent/children').then(r => r.data.children),
  getDashboard: (childId) => api.get(`/parent/dashboard${childId ? `?child_id=${childId}` : ''}`).then(r => r.data),
  getAlerts: (childId, type) => {
    const params = new URLSearchParams();
    if (childId) params.set('child_id', childId);
    if (type && type !== 'all') params.set('type', type);
    const qs = params.toString();
    return api.get(`/parent/alerts${qs ? `?${qs}` : ''}`).then(r => r.data.alerts);
  },
  markAlertRead: (id) => api.patch(`/parent/alerts/${id}/read`).then(r => r.data),
  getRecommendations: (childId) => api.get(`/parent/recommendations${childId ? `?child_id=${childId}` : ''}`).then(r => r.data.recommendations),
  getAchievements: (childId) => api.get(`/parent/achievements${childId ? `?child_id=${childId}` : ''}`).then(r => r.data.achievements),
  getUnreadCount: () => api.get('/parent/unread-count').then(r => r.data),
  getConversations: () => api.get('/parent/conversations').then(r => r.data.conversations),
  getConversationMessages: (conversationId) => api.get(`/parent/conversations/${conversationId}/messages`).then(r => r.data.messages),
  sendMessage: (conversationId, content) => api.post(`/parent/conversations/${conversationId}/messages`, { content }).then(r => r.data.message),
  getTeachers: () => api.get('/parent/teachers').then(r => r.data.teachers),
  startConversation: (teacherId, studentId, subject) => api.post('/parent/conversations', { teacher_id: teacherId, student_id: studentId, subject }).then(r => r.data.conversation),
};
