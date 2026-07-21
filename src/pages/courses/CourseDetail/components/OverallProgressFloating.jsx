import React from 'react';
import { GraduationCap } from 'lucide-react';

export const OverallProgressFloating = ({ percent }) => {
  const dashOffset = 176 - (176 * (percent || 0)) / 100;
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center relative group cursor-pointer border border-outline-variant/10">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="32" cy="32" fill="transparent" r="28" stroke="#e2e2e3" strokeWidth="4" />
          <circle cx="32" cy="32" fill="transparent" r="28" stroke="#004b71" strokeDasharray="176"
            strokeDashoffset={dashOffset} strokeWidth="4" />
        </svg>
        <GraduationCap size={20} className="text-[#004b71] group-hover:scale-110 transition-transform" />
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-[#1a1c1d] text-white py-2 px-4 rounded-xl text-xs font-bold shadow-xl whitespace-nowrap">
            {percent}% del curso completado
          </div>
        </div>
      </div>
    </div>
  );
};
