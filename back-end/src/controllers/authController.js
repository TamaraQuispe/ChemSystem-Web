const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({ success: true, data: { user: req.user.toSafeJSON() } });
};

const updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['student', 'teacher', 'parent'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Rol inválido' });
    }
    req.user.role = role;
    await req.user.save();
    res.json({ success: true, data: { user: req.user.toSafeJSON() } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me, updateRole };
