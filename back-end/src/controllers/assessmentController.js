const assessmentService = require('../services/assessmentService');

const submitAssessment = async (req, res, next) => {
  try {
    const result = await assessmentService.submitAssessment(req.user.id, req.params.assessmentId, req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

const getAttemptsHistory = async (req, res, next) => {
  try {
    const history = await assessmentService.getAttemptsHistory(req.user.id, req.params.assessmentId);
    res.json({ success: true, data: history });
  } catch (err) { next(err); }
};

module.exports = { submitAssessment, getAttemptsHistory };
