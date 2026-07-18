const { Router } = require('express');
const teacherController = require('../controllers/teacherController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

router.use(authenticate, authorize('teacher'));

router.get('/dashboard', teacherController.getDashboard);
router.get('/classes', teacherController.getClasses);
router.post('/classes', teacherController.createClass);
router.get('/classes/:id', teacherController.getClassDetail);
router.post('/classes/:classId/assignments', teacherController.createAssignment);
router.get('/classes/:classId/grades', teacherController.getGrades);
router.patch('/grades/:id', teacherController.updateGrade);
router.get('/classes/:classId/monitor', teacherController.getMonitorData);
router.get('/classes/:classId/predictive', teacherController.getPredictiveData);
router.get('/conversations', teacherController.getConversations);
router.post('/conversations/:conversationId/messages', teacherController.sendMessage);

module.exports = router;
