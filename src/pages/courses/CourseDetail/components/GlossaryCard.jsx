import React from 'react';
import { BookMarked } from 'lucide-react';

export const GlossaryCard = ({ terms }) => (
  <div className="col-span-12 md:col-span-5">
    <div className="bg-white border border-[#d4a017]/20 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookMarked size={18} className="text-[#d4a017]" />
        <span className="text-sm font-bold text-[#d4a017] uppercase tracking-tighter">Glosario</span>
      </div>
      <div className="space-y-3">
        {(terms || []).map((term, ti) => (
          <div key={ti} className="border-b border-[#d4a017]/10 pb-2 last:border-0">
            <span className="text-sm font-bold text-[#1a1c1d]">{term.term}</span>
            <p className="text-xs text-[#40484f] mt-0.5">{term.definition}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
