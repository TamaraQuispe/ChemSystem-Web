const certificateService = require('../services/certificateService');

const generateCertificate = async (req, res, next) => {
  try {
    const cert = await certificateService.generateCertificate(req.user.id, req.params.courseId);
    res.status(201).json({ success: true, data: cert });
  } catch (err) { next(err); }
};

const getUserCertificates = async (req, res, next) => {
  try {
    const certs = await certificateService.getUserCertificates(req.user.id);
    res.json({ success: true, data: certs });
  } catch (err) { next(err); }
};

module.exports = { generateCertificate, getUserCertificates };
