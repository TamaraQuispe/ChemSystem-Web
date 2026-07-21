import React from 'react';
import { Clock } from 'lucide-react';

export const LessonHeader = ({
  title, description, lessonNumber,
  durationMinutes, totalLessonsInModule,
}) => (
  <header className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <span className="px-2.5 py-1 bg-[#004b71]/10 text-[#004b71] text-[10px] font-bold rounded-full uppercase tracking-tighter">
        Lección {lessonNumber}
      </span>
      {durationMinutes && (
        <span className="flex items-center gap-1 px-2.5 py-1 bg-[#f3f3f4] text-[#40484f] text-[10px] font-bold rounded-full">
          <Clock size={10} />
          ~{Math.ceil(durationMinutes / totalLessonsInModule)} min
        </span>
      )}
    </div>
    <h1 className="text-4xl font-headline font-extrabold text-[#1a1c1d] mb-4 tracking-tight">
      {title}
    </h1>
    <p className="text-lg text-[#40484f] leading-relaxed max-w-3xl">
      {description || 'Explora el contenido de esta lección para profundizar tus conocimientos.'}
    </p>
  </header>
);
