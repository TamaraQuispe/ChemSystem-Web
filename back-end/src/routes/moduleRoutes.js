const { Router } = require('express');
const { Module } = require('../models');
const { optionalAuth, authenticate } = require('../middlewares/auth');
const moduleController = require('../controllers/moduleController');

const router = Router();

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const modules = await Module.findAll({
      where: { is_published: true },
      order: [['order_index', 'ASC']],
      attributes: ['id', 'title', 'description', 'slug', 'difficulty', 'category', 'duration_minutes', 'order_index', 'xp_reward', 'thumbnail_url'],
    });
    res.json({ success: true, data: modules });
  } catch (err) { next(err); }
});

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const mod = await Module.findByPk(req.params.id, {
      attributes: ['id', 'title', 'description', 'slug', 'difficulty', 'category', 'duration_minutes', 'order_index', 'xp_reward', 'thumbnail_url'],
    });
    if (!mod) return res.status(404).json({ success: false, message: 'Módulo no encontrado' });
    res.json({ success: true, data: mod });
  } catch (err) { next(err); }
});

router.get('/:id/content', authenticate, moduleController.getModuleContent);

module.exports = router;
