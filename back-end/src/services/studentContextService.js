const {
  CourseProgress, Course, Module, Lesson,
  UserModule, AssessmentAttempt, Assessment,
  QuestionBank, User
} = require('../models');

async function getStudentContext(userId) {
  const context = {
    user: null,
    course: null,
    module: null,
    lesson: null,
    progress: null,
    lastAssessment: null,
    weakConcepts: [],
  };

  const user = await User.findByPk(userId, { attributes: ['id', 'name', 'email'] });
  if (!user) return context;
  context.user = { name: user.name || user.email || 'Estudiante' };

  const progress = await CourseProgress.findOne({
    where: { user_id: userId },
    order: [['started_at', 'DESC']],
    include: [{ model: Course, as: 'course' }],
  });
  if (!progress?.course) return context;

  context.course = {
    id: progress.course.id,
    title: progress.course.title,
    slug: progress.course.slug,
  };

  context.progress = {
    percent: progress.total_modules > 0
      ? Math.round((progress.modules_completed / progress.total_modules) * 100)
      : 0,
    modulesCompleted: progress.modules_completed,
    totalModules: progress.total_modules,
  };

  if (progress.current_module_id) {
    const mod = await Module.findByPk(progress.current_module_id);
    if (mod) {
      context.module = { id: mod.id, title: mod.title, orderIndex: mod.order_index };
      const userMod = await UserModule.findOne({
        where: { user_id: userId, module_id: mod.id },
      });
      if (userMod) {
        context.progress.moduleProgress = userMod.progress_percent;
        context.progress.moduleStatus = userMod.status;
      }
    }
  }

  if (progress.current_lesson_id) {
    const lesson = await Lesson.findByPk(progress.current_lesson_id);
    if (lesson) {
      context.lesson = { id: lesson.id, title: lesson.title, orderIndex: lesson.order_index };
    }
  }

  const attempts = await AssessmentAttempt.findAll({
    where: { user_id: userId, passed: false },
    order: [['started_at', 'DESC']],
    limit: 3,
    include: [{ model: Assessment, as: 'assessment' }],
  });

  if (attempts.length > 0) {
    const last = attempts[0];
    const assessment = last.assessment_id
      ? await Assessment.findByPk(last.assessment_id, {
          include: [{ model: QuestionBank, as: 'questions' }],
        })
      : null;

    const wrongAnswers = [];
    if (assessment?.questions) {
      const answersData = Array.isArray(last.answers) ? last.answers : [];
      for (const ans of answersData) {
        const q = assessment.questions.find(q => q.id === ans.questionId);
        if (q && !ans.isCorrect) {
          const correctOpt = (q.options || []).find(o => o.is_correct);
          wrongAnswers.push({
            question: q.text,
            explanation: q.explanation || '',
            concept: (Array.isArray(q.tags) && q.tags[0]) || 'química general',
          });
        }
      }
    }

    context.lastAssessment = {
      score: last.max_score > 0
        ? Math.round((last.score / last.max_score) * 100)
        : 0,
      passed: last.passed,
      wrongAnswers: wrongAnswers.slice(0, 3),
    };

    const conceptCount = {};
    for (const wa of wrongAnswers) {
      if (wa.concept) {
        conceptCount[wa.concept] = (conceptCount[wa.concept] || 0) + 1;
      }
    }
    context.weakConcepts = Object.entries(conceptCount)
      .sort((a, b) => b[1] - a[1])
      .map(([c]) => c);
  }

  const passedAttempts = await AssessmentAttempt.findAll({
    where: { user_id: userId, passed: true },
    order: [['started_at', 'DESC']],
    limit: 5,
  });
  const strongTags = new Set();
  for (const att of passedAttempts) {
    if (Array.isArray(att.answers)) {
      for (const ans of att.answers) {
        if (ans.isCorrect && ans.tags) {
          (Array.isArray(ans.tags) ? ans.tags : []).forEach(t => strongTags.add(t));
        }
      }
    }
  }
  context.strengths = Array.from(strongTags).slice(0, 3);

  return context;
}

module.exports = { getStudentContext };
