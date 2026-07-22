import React from 'react';
import {
  School, CheckCircle2, Circle, CircleDot, Trophy, ChevronUp, ChevronDown,
  Award
} from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { getLessonCountLabel, getModuleProgressPercent, getModuleStatus } from '../utils/progress';

export const CourseSidebar = ({
  modules, moduleStatuses, expandedModules, currentLesson,
  currentModuleId, currentLessonIdxInModule, totalLessonsInModule,
  moduleAssessments, showAssessment, finalExamState,
  modulesCompleted, totalModules, overallProgress,
  onToggleModule, onSelectLesson, onStartAssessment, onStartFinalExam, onClearLesson,
}) => (
  <aside className="w-80 shrink-0 bg-surface-container-low border-r border-outline-variant/10 overflow-y-auto custom-scrollbar hidden lg:block">
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <School size={18} className="text-[#004b71]" />
        <h3 className="font-headline font-bold text-xs text-[#1a1c1d] uppercase tracking-tighter">
          Índice del Curso
        </h3>
        <span className="ml-auto text-[10px] font-bold text-[#40484f]/60">
          {modulesCompleted}/{totalModules} módulos
        </span>
      </div>

      <div className="h-1 bg-[#e2e2e3] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-[#004b71] rounded-full transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <div className="space-y-3">
        {modules.map((mod, mi) => {
          const modLessons = mod.lessons || [];
          const modStatus = getModuleStatus(moduleStatuses, mod.id);
          const isComplete = modStatus?.moduleComplete || false;
          const isCurrentModule = currentModuleId === mod.id;
          const hasPractice = moduleAssessments[mod.id]?.length > 0;
          const modProgress = isCurrentModule
            ? getModuleProgressPercent(currentLessonIdxInModule, totalLessonsInModule)
            : 0;

          return (
            <div key={mod.id}>
              <button
                onClick={() => onToggleModule(mod.id)}
                className={cn(
                  'flex items-center w-full text-left group rounded-lg p-2 transition-colors',
                  isCurrentModule ? 'bg-[#004b71]/5' : 'hover:bg-[#f0f0f1]'
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <CheckCircle2 size={14} className="text-[#006c4d] shrink-0" />
                    ) : isCurrentModule ? (
                      <CircleDot size={14} className="text-[#004b71] shrink-0" />
                    ) : (
                      <Circle size={14} className="text-[#40484f]/30 shrink-0" />
                    )}
                    <span className={cn(
                      'text-xs font-bold truncate',
                      isCurrentModule ? 'text-[#004b71]' : isComplete ? 'text-[#006c4d]' : 'text-[#40484f]'
                    )}>
                      {mi + 1}. {mod.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 ml-6">
                    <span className="text-[10px] text-[#40484f]/50">
                      {getLessonCountLabel(modLessons.length, isCurrentModule, currentLessonIdxInModule)}
                    </span>
                    {isComplete && (
                      <span className="text-[10px] font-bold text-[#006c4d]">Completado</span>
                    )}
                  </div>
                  {isCurrentModule && totalLessonsInModule > 0 && (
                    <div className="h-1 bg-[#e2e2e3] rounded-full mt-1.5 ml-6 overflow-hidden">
                      <div
                        className="h-full bg-[#004b71] rounded-full transition-all duration-500"
                        style={{ width: `${modProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                {modLessons.length > 0 && (
                  expandedModules[mod.id]
                    ? <ChevronUp size={14} className="text-gray-400 shrink-0" />
                    : <ChevronDown size={14} className="text-gray-400 shrink-0" />
                )}
              </button>

              {expandedModules[mod.id] && modLessons.length > 0 && (
                <ul className="ml-5 space-y-0.5 border-l-2 border-outline-variant/20 mt-1">
                  {modLessons.map((lesson, li) => {
                    const isActive = currentLesson === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => onSelectLesson(lesson.id)}
                          className={cn(
                            'block w-full text-left px-3 py-1.5 text-xs rounded-r-md transition-all flex items-center gap-2',
                            isActive
                              ? 'text-[#004b71] font-bold bg-[#004b71]/8 border-l-2 border-[#004b71] -ml-[2px]'
                              : 'text-[#40484f] hover:text-[#004b71] hover:bg-[#f5f5f6]'
                          )}
                        >
                          <span className={cn(
                            'w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0',
                            isActive ? 'bg-[#004b71] text-white' : 'bg-[#e2e2e3] text-[#40484f]'
                          )}>
                            {li + 1}
                          </span>
                          <span className="truncate leading-tight">{lesson.title}</span>
                        </button>
                      </li>
                    );
                  })}
                  {hasPractice && (
                    <li className="mt-1.5">
                      <button
                        onClick={() => onStartAssessment(mod.id)}
                        className={cn(
                          'flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs font-semibold rounded-r-md transition-all',
                          showAssessment === mod.id
                            ? 'bg-[#007352]/10 text-[#007352] border-l-2 border-[#007352] -ml-[2px]'
                            : 'text-[#007352] hover:bg-[#007352]/5'
                        )}
                      >
                        <Award size={14} className="shrink-0" />
                        Práctica Calificada
                      </button>
                    </li>
                  )}
                </ul>
              )}

              {expandedModules[mod.id] && modLessons.length === 0 && (
                <p className="ml-6 mt-1 text-[10px] text-[#40484f]/60">Sin contenido</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <button onClick={() => finalExamState?.unlocked && onStartFinalExam?.()}
          className={cn(
            'w-full p-3 rounded-xl border-2 border-dashed transition-all group flex flex-col items-center text-center gap-1.5',
            finalExamState?.unlocked
              ? 'border-[#6c228c]/40 bg-[#6c228c]/5 hover:bg-[#6c228c]/10 cursor-pointer'
              : 'border-gray-300 bg-gray-50 cursor-not-allowed'
          )}>
          <Trophy size={22} className={finalExamState?.unlocked ? 'text-[#6c228c]' : 'text-gray-400'} />
          <span className="font-headline font-bold text-xs text-[#6c228c]">Examen Final</span>
          <p className="text-[10px] text-[#40484f]/60 leading-tight">
            {finalExamState?.unlocked ? '¡Disponible!' : 'Requiere todos los módulos'}
          </p>
        </button>
      </div>
    </div>
  </aside>
);
