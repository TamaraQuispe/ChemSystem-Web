const { Certificate, Course, CourseProgress, Assessment, AssessmentAttempt } = require('../models');

async function generateCertificate(userId, courseId) {
  const course = await Course.findByPk(courseId);
  if (!course) throw new Error('Curso no encontrado');

  const progress = await CourseProgress.findOne({ where: { user_id: userId, course_id: courseId } });
  if (!progress || !progress.final_exam_passed) {
    throw new Error('Debes aprobar el examen final para obtener el certificado');
  }

  if (progress.certificate_generated) {
    const existing = await Certificate.findOne({ where: { user_id: userId, course_id: courseId } });
    return existing;
  }

  const code = `CHEM-${course.slug}-${userId.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`;

  const finalExam = await Assessment.findOne({ where: { course_id: courseId, type: 'final_exam' } });
  let finalScore = 0;
  if (finalExam) {
    const attempt = await AssessmentAttempt.findOne({
      where: { user_id: userId, assessment_id: finalExam.id, passed: true },
      order: [['created_at', 'DESC']],
    });
    if (attempt) finalScore = attempt.score;
  }

  const certificate = await Certificate.create({
    user_id: userId,
    course_id: courseId,
    certificate_code: code,
    metadata: {
      courseTitle: course.title,
      finalScore,
      totalModules: progress.total_modules,
      modulesCompleted: progress.modules_completed,
      issuedAt: new Date().toISOString(),
    },
  });

  progress.certificate_generated = true;
  progress.certificate_generated_at = new Date();
  progress.completed_at = new Date();
  await progress.save();

  return certificate;
}

async function getUserCertificates(userId) {
  return Certificate.findAll({
    where: { user_id: userId },
    include: [{ model: Course, as: 'course', attributes: ['id', 'title', 'slug', 'difficulty', 'duration_hours'] }],
    order: [['issued_at', 'DESC']],
  });
}

module.exports = { generateCertificate, getUserCertificates };
