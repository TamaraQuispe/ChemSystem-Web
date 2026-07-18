const { Router } = require('express');
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/dashboard', studentController.getDashboard);
router.get('/progress', studentController.getProgress);
router.post('/lessons/:lessonId/complete', studentController.completeLesson);
router.post('/quiz/complete', studentController.completeQuiz);
router.get('/quiz/history', studentController.getQuizHistory);
router.get('/achievements', studentController.getAchievements);
router.post('/achievements', studentController.createAchievement);
router.patch('/profile', studentController.updateProfile);

module.exports = router;
