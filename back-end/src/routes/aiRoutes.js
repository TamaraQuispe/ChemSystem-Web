const { Router } = require('express');
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middlewares/auth');
const rateLimit = require('../middlewares/rateLimit');

const router = Router();

router.get('/recommendations', aiController.getRecommendations);
router.post('/chat', authenticate, rateLimit, aiController.chat);
router.post('/suggest', authenticate, rateLimit, aiController.suggestInterventions);
router.post('/recommend', authenticate, rateLimit, aiController.recommendForParent);

module.exports = router;
