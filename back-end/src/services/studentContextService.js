const {
  CourseProgress, Course, Module, Lesson,
  UserModule, AssessmentAttempt, Assessment,
  QuestionBank, User
} = require('../models');

function log(level, message, data) {
  if (process.env.NODE_ENV !== 'development') return;
  const prefix = { info: '[CTX]', warn: '[CTX] ⚠', error: '[CTX] ✗' }[level] || '[CTX]';
  console.log(`${prefix} ${message}${data ? ' ' + JSON.stringify(data) : ''}`);
}

async function getStudentContext(userId) {
  try {
    const context = {
      user: null,
      course: null,
      module: null,
      lesson: null,
      progress: null,
      lastAssessment: null,
      weakConcepts: [],
      strengths: [],
    };

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email'],
    });
    if (!user) return context;
    context.user = { name: user.name || user.email || 'Estudiante' };

    // Use started_at for ordering: it's explicitly defined in the model,
    // has defaultValue DataTypes.NOW, and semantically represents
    // "when the student started/engaged with this course".
    // We use the actual JS attribute name from the model.
    // NOTE: database.js sets createdAt: 'created_at' globally, which renames
    // the JS attribute from 'createdAt' to 'created_at'. Using 'started_at'
    // avoids this naming complexity while being semantically equivalent.
    const progress = await CourseProgress.findOne({
      where: { user_id: userId },
      order: [['started_at', 'DESC']],
      include: [{ model: Course, as: 'course', attributes: ['id', 'title', 'slug'] }],
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
      const mod = await Module.findByPk(progress.current_module_id, {
        attributes: ['id', 'title', 'order_index'],
      });
      if (mod) {
        context.module = {
          id: mod.id,
          title: mod.title,
          orderIndex: mod.order_index,
        };

        const userMod = await UserModule.findOne({
          where: { user_id: userId, module_id: mod.id },
          attributes: ['progress_percent', 'status'],
        });
        if (userMod) {
          context.progress.moduleProgress = userMod.progress_percent;
          context.progress.moduleStatus = userMod.status;
        }
      }
    }

    if (progress.current_lesson_id) {
      const lesson = await Lesson.findByPk(progress.current_lesson_id, {
        attributes: ['id', 'title', 'order_index'],
      });
      if (lesson) {
        context.lesson = {
          id: lesson.id,
          title: lesson.title,
          orderIndex: lesson.order_index,
        };
      }
    }

    // Recent failed attempts for weak concept detection
    const attempts = await AssessmentAttempt.findAll({
      where: { user_id: userId, passed: false },
      order: [['started_at', 'DESC']],
      limit: 3,
      attributes: ['id', 'assessment_id', 'score', 'max_score', 'passed', 'answers'],
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
        .map(([c]) => c)
        .slice(0, 5);
    }

    // Passed attempts for strength detection
    const passedAttempts = await AssessmentAttempt.findAll({
      where: { user_id: userId, passed: true },
      order: [['started_at', 'DESC']],
      limit: 5,
      attributes: ['answers'],
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

    log('info', `Context built for user ${userId}`, {
      course: context.course?.slug,
      module: context.module?.title,
      weakConcepts: context.weakConcepts.length,
      strengths: context.strengths.length,
    });

    return context;
  } catch (err) {
    log('error', 'Failed to build student context', { userId, error: err.message });
    // Return minimal context on error — the chatbot should NEVER fail
    // because the academic context couldn't be loaded. The context is
    // a best-effort enrichment, not a requirement.
    return {
      user: null,
      course: null,
      module: null,
      lesson: null,
      progress: null,
      lastAssessment: null,
      weakConcepts: [],
      strengths: [],
    };
  }
}

module.exports = { getStudentContext };
