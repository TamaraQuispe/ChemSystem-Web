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
    const messages = req.body?.messages || [];
    if (!messages.length) {
      return res.status(400).json({ success: false, message: 'Se requiere al menos un mensaje' });
    }
    const result = await aiService.chat(messages);
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
