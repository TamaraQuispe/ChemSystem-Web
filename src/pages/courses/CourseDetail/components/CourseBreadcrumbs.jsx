import React from 'react';
import { ChevronRight } from 'lucide-react';

export const CourseBreadcrumbs = ({ courseTitle, moduleTitle, lessonTitle }) => (
  <nav className="flex items-center gap-2 text-xs text-[#40484f]/60 mb-6 font-medium">
    <span>Módulos</span>
    <ChevronRight size={12} />
    <span className="text-[#004b71] font-bold">{courseTitle}</span>
    {moduleTitle && (
      <>
        <ChevronRight size={12} />
        <span className="text-[#004b71]/70">{moduleTitle}</span>
      </>
    )}
    {lessonTitle && (
      <>
        <ChevronRight size={12} />
        <span className="text-[#004b71] font-bold">{lessonTitle}</span>
      </>
    )}
  </nav>
);
