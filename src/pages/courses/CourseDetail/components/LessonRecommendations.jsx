import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

export const LessonRecommendations = ({ lessons, onNavigateToLesson }) => (
  <div className="bg-[#faf5ff] border border-[#6c228c]/20 rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <BookOpen size={18} className="text-[#6c228c]" />
      <h4 className="text-sm font-bold text-[#6c228c]">Lecciones recomendadas para repasar</h4>
    </div>
    <p className="text-xs text-[#40484f] mb-3">
      Revisa estas lecciones del módulo para reforzar los conceptos donde tuviste dificultades:
    </p>
    <div className="space-y-2">
      {lessons.map((lesson, li) => (
        <button
          key={lesson.id}
          onClick={() => onNavigateToLesson(lesson.id)}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-[#f0e6ff] transition-all text-left border border-transparent hover:border-[#6c228c]/20"
        >
          <span className="w-6 h-6 rounded-full bg-[#6c228c]/10 text-[#6c228c] flex items-center justify-center text-xs font-bold shrink-0">
            {li + 1}
          </span>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-[#1a1c1d] block truncate">{lesson.title}</span>
          </div>
          <ExternalLink size={14} className="text-[#6c228c] shrink-0" />
        </button>
      ))}
    </div>
  </div>
);
