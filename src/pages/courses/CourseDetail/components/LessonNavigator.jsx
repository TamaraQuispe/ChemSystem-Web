import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const LessonNavigator = ({ prevLesson, nextLesson, onPrev, onNext }) => (
  <footer className="pt-8 border-t border-outline-variant/10 flex items-center justify-between">
    <div>
      {prevLesson && (
        <button
          onClick={onPrev}
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#e8e8e9] text-[#40484f] hover:bg-[#e2e2e3] transition-all group"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <div className="text-left">
            <span className="block text-[9px] uppercase font-bold text-slate-400">Anterior</span>
            <span className="font-bold text-xs truncate max-w-[140px] block">{prevLesson.title}</span>
          </div>
        </button>
      )}
    </div>

    {nextLesson && (
      <button
        onClick={onNext}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#004b71] to-[#006494] text-white hover:shadow-lg transition-all group shadow-md"
      >
        <div className="text-right">
          <span className="block text-[9px] uppercase font-bold text-white/70">Continuar</span>
          <span className="font-bold text-sm">{nextLesson.title}</span>
        </div>
        <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
      </button>
    )}

    {!nextLesson && (
      <div className="text-right">
        <p className="text-[10px] text-[#40484f]/60 mb-2">
          Has completado todas las lecciones del curso
        </p>
      </div>
    )}
  </footer>
);
