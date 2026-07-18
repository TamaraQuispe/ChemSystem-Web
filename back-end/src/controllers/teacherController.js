const teacherService = require('../services/teacherService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await teacherService.getDashboard(req.user.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getClasses = async (req, res, next) => {
  try {
    const classes = await teacherService.getClasses(req.user.id);
    res.json({ success: true, data: { classes } });
  } catch (err) { next(err); }
};

const getClassDetail = async (req, res, next) => {
  try {
    const classroom = await teacherService.getClassDetail(req.params.id);
    res.json({ success: true, data: { classroom } });
  } catch (err) { next(err); }
};

const getGrades = async (req, res, next) => {
  try {
    const students = await teacherService.getGrades(req.params.classId);
    res.json({ success: true, data: { students } });
  } catch (err) { next(err); }
};

const updateGrade = async (req, res, next) => {
  try {
    const { score } = req.body;
    const grade = await teacherService.updateGrade(req.params.id, score);
    res.json({ success: true, data: { grade } });
  } catch (err) { next(err); }
};

const getMonitorData = async (req, res, next) => {
  try {
    const data = await teacherService.getMonitorData(req.params.classId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getPredictiveData = async (req, res, next) => {
  try {
    const data = await teacherService.getPredictiveData(req.params.classId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getConversations = async (req, res, next) => {
  try {
    const conversations = await teacherService.getTeacherConversations(req.user.id);
    res.json({ success: true, data: { conversations } });
  } catch (err) { next(err); }
};

const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const message = await teacherService.sendMessage(req.user.id, req.params.conversationId, content);
    res.json({ success: true, data: { message } });
  } catch (err) { next(err); }
};

const createClass = async (req, res, next) => {
  try {
    const classroom = await teacherService.createClass(req.user.id, req.body);
    res.status(201).json({ success: true, data: { classroom } });
  } catch (err) { next(err); }
};

const createAssignment = async (req, res, next) => {
  try {
    const assignment = await teacherService.createAssignment(req.params.classId, req.body);
    res.status(201).json({ success: true, data: { assignment } });
  } catch (err) { next(err); }
};

module.exports = {
  getDashboard, getClasses, getClassDetail, getGrades, updateGrade,
  getMonitorData, getPredictiveData, getConversations, sendMessage,
  createClass, createAssignment,
};
