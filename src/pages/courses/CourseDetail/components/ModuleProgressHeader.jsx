import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { getModuleProgressPercent } from '../utils/progress';

export const ModuleProgressHeader = ({
  moduleObj, moduleIndex, currentLessonId,
  currentLessonIdxInModule, totalLessonsInModule,
  lessonsInModule, onSelectLesson,
}) => {
  if (!moduleObj) return null;

  const progress = getModuleProgressPercent(currentLessonIdxInModule, totalLessonsInModule);

  return (
    <div className="bg-white rounded-2xl p-5 border border-outline-variant/10 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-[#004b71]" />
          <span className="text-xs font-bold text-[#004b71] uppercase tracking-tighter">
            Módulo {moduleIndex + 1}: {moduleObj.title}
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#40484f]/60">
          Lección {Math.min(currentLessonIdxInModule + 1, totalLessonsInModule)} de {totalLessonsInModule}
        </span>
      </div>
      <div className="relative">
        <div className="h-1.5 bg-[#e2e2e3] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#004b71] to-[#006494] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {lessonsInModule.map((l, i) => (
            <button
              key={l.id}
              onClick={() => onSelectLesson(l.id)}
              className={cn(
                'w-2.5 h-2.5 rounded-full border-2 transition-all',
                l.id === currentLessonId
                  ? 'border-[#004b71] bg-[#004b71] scale-125'
                  : i < currentLessonIdxInModule
                    ? 'border-[#006c4d] bg-[#006c4d]'
                    : 'border-[#d0d0d2] bg-white hover:border-[#004b71]'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
