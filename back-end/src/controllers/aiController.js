const { AiRecommendation } = require('../models');
const aiService = require('../services/aiService');

const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await AiRecommendation.findAll({
      where: { is_active: true }, order: [['priority', 'ASC']],
    });
    res.json({ success: true, data: recommendations });
  } catch (err) { next(err); }
};

const chat = async (req, res, next) => {
  try {
    const userMsg = req.body?.messages?.[0]?.content || req.body?.message || 'sin mensaje';
    const result = { reply: `👋 ¡Hola! Recibí tu mensaje: "${userMsg.substring(0, 50)}"` };
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

const suggestInterventions = async (req, res, next) => {
  try {
    const suggestions = await aiService.suggestInterventions(req.body.atRiskStudents || [], req.body.className || '');
    res.json({ success: true, data: suggestions });
  } catch (err) { next(err); }
};

const recommendForParent = async (req, res, next) => {
  try {
    const result = await aiService.recommendForParent(req.body.studentName || '', req.body.kpis || {}, req.body.subjectProgress || []);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

const testConnection = async (req, res, next) => {
  try {
    const result = await aiService.testConnection();
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

module.exports = { getRecommendations, chat, suggestInterventions, recommendForParent, testConnection };
