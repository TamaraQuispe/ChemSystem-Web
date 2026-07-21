const { Router } = require('express');
const { body } = require('express-validator');
const teacherController = require('../controllers/teacherController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = Router();

router.use(authenticate, authorize('teacher'));

router.get('/dashboard', teacherController.getDashboard);
router.get('/classes', teacherController.getClasses);
router.post('/classes', teacherController.createClass);
router.get('/classes/:id', teacherController.getClassDetail);
router.get('/classes/:id/overview', teacherController.getClassroomOverview);
router.patch('/classes/:id', teacherController.updateClassroom);
router.post('/classes/:classId/assignments', teacherController.createAssignment);
router.get('/classes/:classId/grades', teacherController.getGrades);
router.post('/classes/:classId/grades/publish', teacherController.publishGrades);
router.patch('/grades/:id', teacherController.updateGrade);
router.get('/classes/:classId/monitor', teacherController.getMonitorData);
router.get('/classes/:classId/predictive', teacherController.getPredictiveData);
router.get('/conversations', teacherController.getConversations);
router.get('/conversations/:conversationId/messages', teacherController.getConversationMessages);
router.post('/conversations/:conversationId/messages', body('content').trim().notEmpty().isLength({ max: 2000 }), validate, teacherController.sendMessage);
router.post('/conversations', teacherController.startConversation);

module.exports = router;
