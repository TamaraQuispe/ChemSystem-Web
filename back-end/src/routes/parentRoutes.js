const { Router } = require('express');
const parentController = require('../controllers/parentController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

router.use(authenticate, authorize('parent'));

router.get('/children', parentController.getChildren);
router.get('/dashboard', parentController.getDashboard);
router.get('/alerts', parentController.getAlerts);
router.patch('/alerts/:id/read', parentController.markAlertRead);
router.get('/recommendations', parentController.getRecommendations);
router.get('/achievements', parentController.getAchievements);

router.get('/unread-count', parentController.getUnreadCount);

router.get('/teachers', parentController.getTeachers);
router.get('/conversations', parentController.getConversations);
router.get('/conversations/:conversationId/messages', parentController.getConversationMessages);
router.post('/conversations/:conversationId/messages', parentController.sendMessage);
router.post('/conversations', parentController.startConversation);

module.exports = router;
