const courseService = require('../services/courseService');

const listCourses = async (req, res, next) => {
  try {
    const courses = await courseService.listCourses(req.user?.id);
    res.json({ success: true, data: courses });
  } catch (err) { next(err); }
};

const getCourseTree = async (req, res, next) => {
  try {
    const data = await courseService.getCourseTree(req.params.id, req.user?.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getLessonContent = async (req, res, next) => {
  try {
    const data = await courseService.getLessonContent(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getModuleAssessments = async (req, res, next) => {
  try {
    const data = await courseService.getModuleAssessments(req.params.moduleId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const getCourseFinalExam = async (req, res, next) => {
  try {
    const data = await courseService.getCourseFinalExam(req.params.courseId);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { listCourses, getCourseTree, getLessonContent, getModuleAssessments, getCourseFinalExam };
