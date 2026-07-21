const studentService = require('../services/studentService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await studentService.getDashboard(req.user.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getProgress = async (req, res, next) => {
  try {
    const data = await studentService.getProgress(req.user.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const completeLesson = async (req, res, next) => {
  try {
    const result = await studentService.completeLesson(req.user.id, req.params.lessonId);
    res.json({ success: true, data: { module: result } });
  } catch (err) { next(err); }
};

const completeQuiz = async (req, res, next) => {
  try {
    const result = await studentService.completeQuiz(req.user.id, req.body);
    res.status(201).json({ success: true, data: { quizResult: result } });
  } catch (err) { next(err); }
};

const getQuizHistory = async (req, res, next) => {
  try {
    const results = await studentService.getQuizHistory(req.user.id);
    res.json({ success: true, data: { results } });
  } catch (err) { next(err); }
};

const getAchievements = async (req, res, next) => {
  try {
    const achievements = await studentService.getAchievements(req.user.id);
    res.json({ success: true, data: { achievements } });
  } catch (err) { next(err); }
};

const createAchievement = async (req, res, next) => {
  try {
    const achievement = await studentService.createAchievement(req.user.id, req.body);
    res.status(201).json({ success: true, data: { achievement } });
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await studentService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data: { user } });
  } catch (err) { next(err); }
};

const getConversations = async (req, res, next) => {
  try {
    const conversations = await studentService.getConversations(req.user.id);
    res.json({ success: true, data: { conversations } });
  } catch (err) { next(err); }
};

const getConversationMessages = async (req, res, next) => {
  try {
    const messages = await studentService.getConversationMessages(req.params.conversationId, req.user.id);
    res.json({ success: true, data: { messages } });
  } catch (err) { next(err); }
};

const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const message = await studentService.sendMessage(req.user.id, req.params.conversationId, content);
    res.json({ success: true, data: { message } });
  } catch (err) { next(err); }
};

module.exports = {
  getDashboard, getProgress, completeLesson, completeQuiz,
  getQuizHistory, getAchievements, createAchievement, updateProfile,
  getConversations, getConversationMessages, sendMessage,
};
