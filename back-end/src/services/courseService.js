const { Course, Module, Lesson, Assessment, AssessmentAttempt, QuestionBank, UserModule, CourseProgress } = require('../models');

async function listCourses(userId) {
  const courses = await Course.findAll({ where: { is_published: true }, order: [['order_index', 'ASC']] });
  return courses;
}

async function getCourseTree(courseIdOrSlug, userId) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseIdOrSlug);
  const course = isUUID
    ? await Course.findByPk(courseIdOrSlug)
    : await Course.findOne({ where: { slug: courseIdOrSlug } });
  if (!course) throw new Error('Curso no encontrado');
  const courseId = course.id;

  const modules = await Module.findAll({
    where: { course_id: courseId, is_published: true },
    include: [{ model: Lesson, as: 'lessons', where: { is_published: true }, required: false }],
    order: [['order_index', 'ASC']],
  });

  let userProgress = null;
  if (userId) {
    [userProgress] = await CourseProgress.findOrCreate({
      where: { user_id: userId, course_id: courseId },
      defaults: { user_id: userId, course_id: courseId, total_modules: modules.length, started_at: new Date() },
    });
  }

  // Check final exam unlock status
  let finalExamUnlocked = false;
  let finalExam = null;
  if (userId) {
    finalExam = await Assessment.findOne({
      where: { course_id: courseId, type: 'final_exam', is_published: true },
      include: [{ model: QuestionBank, as: 'questions' }],
    });
  }

  // Determine module completion status
  const moduleStatuses = await Promise.all(modules.map(async (mod) => {
    const assessments = await Assessment.findAll({
      where: { module_id: mod.id, type: 'graded_practice', is_published: true },
    });
    let moduleComplete = true;
    for (const ass of assessments) {
      const passed = await AssessmentAttempt.findOne({
        where: { assessment_id: ass.id, user_id: userId, passed: true },
      });
      if (!passed) { moduleComplete = false; break; }
    }
    const completedLessons = mod.lessons?.length > 0 ? true : false;
    return { moduleId: mod.id, moduleComplete: moduleComplete && completedLessons, lessonsCompleted: true };
  }));

  const allModulesComplete = moduleStatuses.every(m => m.moduleComplete);
  const completedCount = moduleStatuses.filter(m => m.moduleComplete).length;

  if (finalExam && userId && allModulesComplete) {
    finalExamUnlocked = true;
    await userProgress.update({ final_exam_unlocked: true, modules_completed: completedCount, assessments_passed: completedCount });
  }

  return { course, modules, userProgress, finalExamUnlocked, finalExam, moduleStatuses };
}

async function getLessonContent(lessonId) {
  const lesson = await Lesson.findByPk(lessonId);
  if (!lesson) throw new Error('Lección no encontrada');

  const assessments = await Assessment.findAll({
    where: { lesson_id: lessonId, is_published: true },
    include: [{ model: QuestionBank, as: 'questions' }],
  });

  return { lesson, assessments };
}

async function getModuleAssessments(moduleId) {
  return Assessment.findAll({
    where: { module_id: moduleId, is_published: true, type: 'graded_practice' },
    include: [{ model: QuestionBank, as: 'questions' }],
  });
}

async function getCourseFinalExam(courseId) {
  return Assessment.findOne({
    where: { course_id: courseId, type: 'final_exam', is_published: true },
    include: [{ model: QuestionBank, as: 'questions' }],
  });
}

module.exports = { listCourses, getCourseTree, getLessonContent, getModuleAssessments, getCourseFinalExam };
