export const getAllLessonsFlat = (modules) =>
  modules?.flatMap(m => m.lessons || []) || [];

export const getPrevLesson = (allLessons, currentIdx) =>
  currentIdx > 0 ? allLessons[currentIdx - 1] : null;

export const getNextLesson = (allLessons, currentIdx) =>
  currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

export const getCurrentModule = (modules, moduleId) =>
  modules?.find(m => m.id === moduleId);

export const getModuleIndex = (modules, moduleId) =>
  modules?.findIndex(m => m.id === moduleId) ?? -1;

export const getLessonIndexInModule = (moduleObj, lessonId) =>
  moduleObj?.lessons?.findIndex(l => l.id === lessonId) ?? -1;

export const isLastLessonInModule = (moduleObj, lessonId) => {
  const lessons = moduleObj?.lessons || [];
  return lessons.length > 0 && lessons[lessons.length - 1]?.id === lessonId;
};

export const isFirstLessonInModule = (moduleObj, lessonId) => {
  const lessons = moduleObj?.lessons || [];
  return lessons.length > 0 && lessons[0]?.id === lessonId;
};

export const hasQuickChecks = (lessonContent) =>
  (lessonContent?.assessments || []).some(a => a.type === 'quick_check');

export const getQuickCheck = (lessonContent) =>
  (lessonContent?.assessments || []).find(a => a.type === 'quick_check');
