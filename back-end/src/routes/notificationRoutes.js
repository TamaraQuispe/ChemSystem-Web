const { Router } = require('express');
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/auth');

const router = Router();
router.use(authenticate);

router.get('/', notificationController.listNotifications);
router.post('/', notificationController.createNotification);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
