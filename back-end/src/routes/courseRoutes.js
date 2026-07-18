const { Router } = require('express');
const courseController = require('../controllers/courseController');
const { authenticate, optionalAuth } = require('../middlewares/auth');

const router = Router();

router.get('/', optionalAuth, courseController.listCourses);
router.get('/:id/tree', optionalAuth, courseController.getCourseTree);
router.get('/lessons/:id', authenticate, courseController.getLessonContent);
router.get('/modules/:moduleId/assessments', authenticate, courseController.getModuleAssessments);
router.get('/:courseId/final-exam', authenticate, courseController.getCourseFinalExam);

module.exports = router;
