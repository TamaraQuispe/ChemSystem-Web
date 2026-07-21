import React from 'react';
import { BookOpen } from 'lucide-react';

export const EmptyState = () => (
  <div className="max-w-3xl mx-auto text-center py-20">
    <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
    <h3 className="text-lg font-black text-[#1a1c1d] mb-2">Selecciona una lección</h3>
    <p className="text-sm font-semibold text-[#40484f]">
      Elige una lección del índice del curso para comenzar
    </p>
  </div>
);
