const moduleService = require('../services/moduleService');

const getModuleContent = async (req, res, next) => {
  try {
    const data = await moduleService.getModuleContent(req.params.id, req.user?.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getModuleContent };
