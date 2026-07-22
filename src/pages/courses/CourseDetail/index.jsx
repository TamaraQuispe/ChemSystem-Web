import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../services/api';
import { useCourseData } from './hooks/useCourseData';
import { useLessonLoader } from './hooks/useLessonLoader';
import { useModuleAssessments } from './hooks/useModuleAssessments';
import {
  getAllLessonsFlat, getPrevLesson, getNextLesson,
  getCurrentModule, getLessonIndexInModule, isLastLessonInModule,
} from './utils/navigation';
import {
  getModulesCompleted, getTotalModules, getOverallProgress,
} from './utils/progress';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';
import { CourseSidebar } from './components/CourseSidebar';
import { CourseBreadcrumbs } from './components/CourseBreadcrumbs';
import { EmptyState } from './components/EmptyState';
import { LessonSkeleton } from './components/LessonSkeleton';
import { ModuleProgressHeader } from './components/ModuleProgressHeader';
import { LessonHeader } from './components/LessonHeader';
import { LessonContent } from './components/LessonContent';
import { LessonNavigator } from './components/LessonNavigator';
import { KnowledgeCheckView } from './components/KnowledgeCheckView';
import { ModuleCompleteScreen } from './components/ModuleCompleteScreen';
import { AssessmentView } from './components/AssessmentView';
import { OverallProgressFloating } from './components/OverallProgressFloating';

const CourseDetail = () => {
  const { courseSlug } = useParams();
  const { data, loading, error } = useCourseData(courseSlug);
  const {
    currentLesson, lessonContent, lessonLoading,
    loadLesson, clearLesson,
  } = useLessonLoader();
  const { moduleAssessments, fetchAssessment } = useModuleAssessments();

  const [expandedModules, setExpandedModules] = useState({});
  const [activeAssessmentId, setActiveAssessmentId] = useState(null);
  const [showModuleComplete, setShowModuleComplete] = useState(false);
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(null);
  const [knowledgeCheckResult, setKnowledgeCheckResult] = useState(null);
  const hasInitialized = useRef(false);

  const allLessons = useMemo(() => getAllLessonsFlat(data?.modules), [data]);
  const currentIdx = useMemo(() => allLessons.findIndex(l => l.id === currentLesson), [allLessons, currentLesson]);
  const prevLesson = useMemo(() => getPrevLesson(allLessons, currentIdx), [allLessons, currentIdx]);
  const nextLesson = useMemo(() => getNextLesson(allLessons, currentIdx), [allLessons, currentIdx]);

  const currentModuleId = lessonContent?.lesson?.module_id;
  const currentModuleObj = useMemo(() => getCurrentModule(data?.modules, currentModuleId), [data, currentModuleId]);
  const lessonsInModule = currentModuleObj?.lessons || [];
  const currentLessonIdxInModule = useMemo(
    () => getLessonIndexInModule(currentModuleObj, currentLesson),
    [currentModuleObj, currentLesson],
  );
  const totalLessonsInModule = lessonsInModule.length;
  const isLastInModule = useMemo(
    () => isLastLessonInModule(currentModuleObj, currentLesson),
    [currentModuleObj, currentLesson],
  );

  const finalExamState = useMemo(() => data ? {
    unlocked: data.finalExamUnlocked,
    exam: data.finalExam,
    statuses: data.moduleStatuses,
  } : null, [data]);

  const modulesCompleted = useMemo(() => getModulesCompleted(data?.moduleStatuses), [data]);
  const totalModules = useMemo(() => getTotalModules(data?.modules), [data]);
  const overallProgress = useMemo(
    () => getOverallProgress(modulesCompleted, totalModules),
    [modulesCompleted, totalModules],
  );

  useEffect(() => {
    if (data && !hasInitialized.current) {
      hasInitialized.current = true;
      const firstMod = data.modules?.[0];
      if (firstMod) {
        setExpandedModules({ [firstMod.id]: true });
        if (firstMod.lessons?.[0]) {
          loadLesson(firstMod.lessons[0].id).then(content => {
            if (content?.lesson?.module_id) {
              fetchAssessment(content.lesson.module_id);
            }
          });
        }
      }
    }
  }, [data, loadLesson, fetchAssessment]);

  const handleSelectLesson = useCallback(async (lessonId) => {
    if (!lessonId || lessonId === currentLesson) return;
    setActiveAssessmentId(null);
    setShowModuleComplete(false);
    setShowKnowledgeCheck(null);
    setKnowledgeCheckResult(null);
    const content = await loadLesson(lessonId);
    if (!content?.lesson) return;
    const modId = content.lesson.module_id;
    if (modId) {
      fetchAssessment(modId);
      setExpandedModules(prev => ({ ...prev, [modId]: true }));
    }
  }, [currentLesson, loadLesson, fetchAssessment]);

  const handleNextLesson = useCallback(() => {
    const quickCheck = lessonContent?.assessments?.find(a => a.type === 'quick_check');
    if (quickCheck && !showKnowledgeCheck && !knowledgeCheckResult) {
      setShowKnowledgeCheck(quickCheck);
      setKnowledgeCheckResult(null);
      return;
    }
    if (knowledgeCheckResult) {
      setShowKnowledgeCheck(null);
      setKnowledgeCheckResult(null);
    }
    if (isLastInModule && !showModuleComplete) {
      setShowModuleComplete(true);
      return;
    }
    if (nextLesson) handleSelectLesson(nextLesson.id);
  }, [lessonContent, showKnowledgeCheck, knowledgeCheckResult, isLastInModule, showModuleComplete, nextLesson, handleSelectLesson]);

  const handlePrevLesson = useCallback(() => {
    setActiveAssessmentId(null);
    setShowModuleComplete(false);
    setShowKnowledgeCheck(null);
    setKnowledgeCheckResult(null);
    if (prevLesson) handleSelectLesson(prevLesson.id);
  }, [prevLesson, handleSelectLesson]);

  const handleKnowledgeCheckSubmit = useCallback(async (answers) => {
    if (!showKnowledgeCheck) return;
    try {
      const res = await api.post(`/assessments/${showKnowledgeCheck.id}/submit`, {
        answers: Object.entries(answers).map(([qId, optId]) => ({
          questionId: qId, selectedOptionId: optId,
        })),
        timeSpentSeconds: 0,
      });
      setKnowledgeCheckResult(res.data);
    } catch (err) {
      alert(err.message);
    }
  }, [showKnowledgeCheck]);

  const handleKnowledgeCheckContinue = useCallback(() => {
    setShowKnowledgeCheck(null);
    setKnowledgeCheckResult(null);
    handleNextLesson();
  }, [handleNextLesson]);

  const handleModuleCompleteContinue = useCallback(() => {
    setShowModuleComplete(false);
    if (nextLesson) handleSelectLesson(nextLesson.id);
  }, [nextLesson, handleSelectLesson]);

  const handleStartAssessment = useCallback((moduleId) => {
    setActiveAssessmentId(moduleId);
    setShowModuleComplete(false);
    setShowKnowledgeCheck(null);
    setKnowledgeCheckResult(null);
    clearLesson();
    if (moduleId && !moduleAssessments[moduleId]) {
      fetchAssessment(moduleId);
    }
  }, [clearLesson, moduleAssessments, fetchAssessment]);

  const handleStartFinalExam = useCallback(() => {
    const exam = finalExamState?.exam;
    if (!exam?.id) return;
    setActiveAssessmentId(exam.id);
    setShowModuleComplete(false);
    setShowKnowledgeCheck(null);
    setKnowledgeCheckResult(null);
    clearLesson();
  }, [finalExamState, clearLesson]);

  const handleGoToPractice = useCallback(() => {
    setShowModuleComplete(false);
    setActiveAssessmentId(currentModuleId);
    clearLesson();
  }, [currentModuleId, clearLesson]);

  const toggleModule = useCallback((moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error || !data?.course) return <ErrorState error={error} />;

  const { course, modules } = data;

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#f9f9fa]">
      <CourseSidebar
        modules={modules}
        moduleStatuses={data?.moduleStatuses}
        expandedModules={expandedModules}
        currentLesson={currentLesson}
        currentModuleId={currentModuleId}
        currentLessonIdxInModule={currentLessonIdxInModule}
        totalLessonsInModule={totalLessonsInModule}
        moduleAssessments={moduleAssessments}
        showAssessment={activeAssessmentId}
        finalExamState={finalExamState}
        modulesCompleted={modulesCompleted}
        totalModules={totalModules}
        overallProgress={overallProgress}
        onToggleModule={toggleModule}
        onSelectLesson={handleSelectLesson}
        onStartAssessment={handleStartAssessment}
        onStartFinalExam={handleStartFinalExam}
      />

      <div className="flex-grow overflow-y-auto px-8 lg:px-12 py-8 relative">
        <div className="absolute top-10 right-10 w-64 h-64 border border-[#004b71]/20 rounded-full blur-3xl bg-[#004b71]/5 pointer-events-none" />
        <div className="absolute -bottom-20 left-20 w-96 h-96 border border-[#006c4d]/20 rounded-full blur-3xl bg-[#006c4d]/5 pointer-events-none" />

        <CourseBreadcrumbs
          courseTitle={course.title}
          moduleTitle={currentModuleObj?.title}
          lessonTitle={lessonContent?.lesson?.title}
        />

        {showModuleComplete ? (
          <ModuleCompleteScreen
            module={currentModuleObj}
            moduleIndex={modules.findIndex(m => m.id === currentModuleId)}
            totalModules={totalModules}
            hasPractice={moduleAssessments[currentModuleId]?.length > 0}
            onContinue={handleModuleCompleteContinue}
            onPractice={handleGoToPractice}
          />
        ) : activeAssessmentId ? (
          <AssessmentView
            assessment={moduleAssessments[activeAssessmentId]?.[0] || finalExamState?.exam}
            onBack={() => setActiveAssessmentId(null)}
            courseId={courseSlug}
            courseTitle={course.title}
            moduleId={activeAssessmentId}
            isFinalExam={activeAssessmentId === finalExamState?.exam?.id}
            lessons={modules.find(m => m.id === activeAssessmentId)?.lessons || []}
            onNavigateToLesson={handleSelectLesson}
          />
        ) : showKnowledgeCheck ? (
          <KnowledgeCheckView
            assessment={showKnowledgeCheck}
            result={knowledgeCheckResult}
            onSubmit={handleKnowledgeCheckSubmit}
            onContinue={handleKnowledgeCheckContinue}
            onRetry={() => setKnowledgeCheckResult(null)}
          />
        ) : lessonLoading ? (
          <LessonSkeleton />
        ) : lessonContent ? (
          <div className="max-w-5xl mx-auto space-y-8">
            <ModuleProgressHeader
              moduleObj={currentModuleObj}
              moduleIndex={modules.findIndex(m => m.id === currentModuleId)}
              currentLessonId={currentLesson}
              currentLessonIdxInModule={currentLessonIdxInModule}
              totalLessonsInModule={totalLessonsInModule}
              lessonsInModule={lessonsInModule}
              onSelectLesson={handleSelectLesson}
            />

            <LessonHeader
              title={lessonContent.lesson?.title}
              description={lessonContent.lesson?.description}
              lessonNumber={currentLessonIdxInModule + 1}
              durationMinutes={currentModuleObj?.duration_minutes}
              totalLessonsInModule={totalLessonsInModule}
            />

            <LessonContent
              content_blocks={lessonContent.lesson?.content_blocks}
              durationMinutes={currentModuleObj?.duration_minutes}
            />

            <LessonNavigator
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onPrev={handlePrevLesson}
              onNext={handleNextLesson}
            />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      <OverallProgressFloating percent={overallProgress} />
    </div>
  );
};

export default CourseDetail;
