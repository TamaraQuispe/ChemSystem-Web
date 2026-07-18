const parentService = require('../services/parentService');

const getChildren = async (req, res, next) => {
  try {
    const children = await parentService.getChildren(req.user.id);
    res.json({ success: true, data: { children } });
  } catch (err) {
    next(err);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const { child_id } = req.query;
    const studentId = child_id || req.user.id;
    const data = await parentService.getDashboard(req.user.id, studentId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getAlerts = async (req, res, next) => {
  try {
    const { child_id, type } = req.query;
    const studentId = child_id || req.user.id;
    const data = await parentService.getAlerts(req.user.id, studentId, { type });
    res.json({ success: true, data: { alerts: data } });
  } catch (err) {
    next(err);
  }
};

const markAlertRead = async (req, res, next) => {
  try {
    const result = await parentService.markAlertRead(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getRecommendations = async (req, res, next) => {
  try {
    const { child_id } = req.query;
    const studentId = child_id || req.user.id;
    const data = await parentService.getRecommendations(req.user.id, studentId);
    res.json({ success: true, data: { recommendations: data } });
  } catch (err) {
    next(err);
  }
};

const getAchievements = async (req, res, next) => {
  try {
    const { child_id } = req.query;
    const studentId = child_id || req.user.id;
    const data = await parentService.getAchievements(req.user.id, studentId);
    res.json({ success: true, data: { achievements: data } });
  } catch (err) {
    next(err);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await parentService.getUnreadCount(req.user.id);
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const conversations = await parentService.getConversations(req.user.id);
    res.json({ success: true, data: { conversations } });
  } catch (err) {
    next(err);
  }
};

const getConversationMessages = async (req, res, next) => {
  try {
    const messages = await parentService.getConversationMessages(req.params.conversationId);
    res.json({ success: true, data: { messages } });
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const message = await parentService.sendMessage(req.user.id, req.params.conversationId, content);
    res.json({ success: true, data: { message } });
  } catch (err) {
    next(err);
  }
};

const getTeachers = async (req, res, next) => {
  try {
    const teachers = await parentService.getTeachers();
    res.json({ success: true, data: { teachers } });
  } catch (err) {
    next(err);
  }
};

const startConversation = async (req, res, next) => {
  try {
    const { teacher_id, student_id, subject } = req.body;
    const conversation = await parentService.startConversation(req.user.id, teacher_id, student_id, subject);
    res.json({ success: true, data: { conversation } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getChildren, getDashboard, getAlerts, markAlertRead,
  getRecommendations, getAchievements,
  getUnreadCount, getConversations, getConversationMessages,
  sendMessage, getTeachers, startConversation,
};
