const { Router } = require('express');
const aiController = require('../controllers/aiController');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.get('/recommendations', aiController.getRecommendations);
router.post('/chat', authenticate, aiController.chat);
router.post('/suggest', authenticate, aiController.suggestInterventions);
router.post('/recommend', authenticate, aiController.recommendForParent);

module.exports = router;
