export const getModulesCompleted = (moduleStatuses) =>
  moduleStatuses?.filter(ms => ms.moduleComplete)?.length || 0;

export const getTotalModules = (modules) =>
  modules?.length || 0;

export const getOverallProgress = (modulesCompleted, totalModules) =>
  totalModules > 0 ? Math.round((modulesCompleted / totalModules) * 100) : 0;

export const getModuleStatus = (moduleStatuses, moduleId) =>
  moduleStatuses?.find(ms => ms.moduleId === moduleId);

export const getModuleProgressPercent = (currentLessonIdx, totalLessons) =>
  totalLessons > 0
    ? Math.round(((currentLessonIdx + 1) / totalLessons) * 100)
    : 0;

export const getLessonCountLabel = (total, isCurrentModule, currentIdx) => {
  if (isCurrentModule) {
    return `${Math.min(currentIdx + 1, total)}/${total} lecciones`;
  }
  return `${total} lecciones`;
};
