const { upload, uploadToS3 } = require('../middlewares/upload');

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se seleccionó ningún archivo' });
    }
    const result = await uploadToS3(req.file, req.body.folder || 'assignments');
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadFile };
