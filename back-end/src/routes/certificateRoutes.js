const { Router } = require('express');
const certificateController = require('../controllers/certificateController');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.post('/courses/:courseId/generate', certificateController.generateCertificate);
router.get('/mine', certificateController.getUserCertificates);

module.exports = router;
