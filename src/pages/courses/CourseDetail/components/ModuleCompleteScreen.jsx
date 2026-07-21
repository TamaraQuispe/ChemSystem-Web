import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, GraduationCap, Sparkles, Clock,
  BookOpen, Award, ArrowRight
} from 'lucide-react';
import { cn } from '../../../../utils/cn';

const CompletionStats = ({ lessonsCount, xpReward, durationMinutes }) => (
  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
    <div className="bg-white rounded-2xl p-5 border border-outline-variant/10 text-center shadow-sm">
      <GraduationCap size={24} className="text-[#004b71] mx-auto mb-2" />
      <p className="text-2xl font-headline font-bold text-[#1a1c1d]">{lessonsCount}</p>
      <p className="text-[10px] font-bold text-[#40484f]/60 uppercase tracking-tighter">Lecciones</p>
    </div>
    <div className="bg-white rounded-2xl p-5 border border-outline-variant/10 text-center shadow-sm">
      <Sparkles size={24} className="text-[#d4a017] mx-auto mb-2" />
      <p className="text-2xl font-headline font-bold text-[#1a1c1d]">{xpReward || 100}</p>
      <p className="text-[10px] font-bold text-[#40484f]/60 uppercase tracking-tighter">XP Ganados</p>
    </div>
    <div className="bg-white rounded-2xl p-5 border border-outline-variant/10 text-center shadow-sm">
      <Clock size={24} className="text-[#006c4d] mx-auto mb-2" />
      <p className="text-2xl font-headline font-bold text-[#1a1c1d]">{durationMinutes || '—'}</p>
      <p className="text-[10px] font-bold text-[#40484f]/60 uppercase tracking-tighter">Minutos</p>
    </div>
  </div>
);

const LessonsSummary = ({ lessons }) => (
  <div className="bg-white rounded-3xl p-6 border border-outline-variant/10 max-w-2xl mx-auto shadow-sm">
    <h4 className="text-sm font-bold text-[#1a1c1d] mb-4 flex items-center gap-2">
      <BookOpen size={16} className="text-[#004b71]" />
      Lecciones completadas
    </h4>
    <div className="space-y-2">
      {lessons?.map((lesson, i) => (
        <div key={lesson.id} className="flex items-center gap-3 text-sm">
          <div className="w-6 h-6 rounded-full bg-[#86f8c8]/30 text-[#006c4d] flex items-center justify-center">
            <CheckCircle2 size={14} />
          </div>
          <span className={cn(
            i < lessons.length - 1 ? 'pb-2 border-b border-outline-variant/10 w-full' : 'w-full'
          )}>
            {lesson.title}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const ModuleCompleteScreen = ({
  module, moduleIndex, totalModules, hasPractice, onContinue, onPractice,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#86f8c8] to-[#006c4d] flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <CheckCircle2 size={48} className="text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          className="text-3xl font-headline font-extrabold text-[#1a1c1d] mb-2"
        >
          ¡Módulo Completado!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-lg text-[#40484f]"
        >
          {module?.title || 'Módulo'} — {moduleIndex + 1} de {totalModules}
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <CompletionStats
              lessonsCount={module?.lessons?.length || 0}
              xpReward={module?.xp_reward}
              durationMinutes={module?.duration_minutes}
            />
            <LessonsSummary lessons={module?.lessons} />

            <div className="flex flex-col items-center gap-4 pt-4">
              {hasPractice && (
                <button onClick={onPractice}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#007352] to-[#00a86b] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
                  <Award size={20} />
                  Realizar Práctica Calificada
                </button>
              )}
              {moduleIndex < totalModules - 1 && (
                <button onClick={onContinue}
                  className="px-6 py-3 rounded-2xl bg-[#e8e8e9] text-[#40484f] font-bold text-sm hover:bg-[#e2e2e3] transition-all flex items-center gap-2">
                  Continuar al siguiente módulo
                  <ArrowRight size={16} />
                </button>
              )}
              {moduleIndex >= totalModules - 1 && (
                <p className="text-sm text-[#40484f]/70">Has completado el último módulo. ¡Felicidades!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
