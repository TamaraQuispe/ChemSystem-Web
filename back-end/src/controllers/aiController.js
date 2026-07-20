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

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY = 20;

const chat = async (req, res, next) => {
  try {
    const messages = req.body?.messages || [];
    if (!messages.length) {
      return res.status(400).json({ success: false, message: 'Se requiere al menos un mensaje' });
    }
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg?.content || typeof lastMsg.content !== 'string') {
      return res.status(400).json({ success: false, message: 'Mensaje inválido' });
    }
    if (lastMsg.content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ success: false, message: `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres` });
    }
    const limited = messages.slice(-MAX_HISTORY);
    const sanitized = limited.map(m => ({
      role: m.role === 'system' ? 'system' : m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content).slice(0, MAX_MESSAGE_LENGTH),
    }));
    const result = await aiService.chat(sanitized);
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
