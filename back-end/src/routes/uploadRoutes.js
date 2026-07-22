const { Router } = require('express');
const { upload } = require('../middlewares/upload');
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.post('/', authenticate, upload.single('file'), uploadController.uploadFile);

module.exports = router;
