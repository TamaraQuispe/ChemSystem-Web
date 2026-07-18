const { Router } = require('express');
const assessmentController = require('../controllers/assessmentController');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.post('/:assessmentId/submit', assessmentController.submitAssessment);
router.get('/:assessmentId/history', assessmentController.getAttemptsHistory);

module.exports = router;
