import React from 'react';
import { FlaskConical, Target, BookMarked } from 'lucide-react';

export const LaboratoryCard = ({ data }) => (
  <div className="col-span-12">
    <div className="bg-white border border-[#004b71]/20 rounded-3xl overflow-hidden">
      <div className="bg-[#004b71] px-6 py-3 flex items-center gap-3">
        <FlaskConical size={18} className="text-white" />
        <span className="text-sm font-bold text-white uppercase tracking-tighter">
          Laboratorio: {data?.title || 'Actividad Práctica'}
        </span>
      </div>
      <div className="p-6 space-y-4">
        {data?.objective && (
          <div className="flex items-start gap-2 text-sm text-[#40484f]">
            <Target size={16} className="text-[#004b71] mt-0.5 shrink-0" />
            <span><strong>Objetivo:</strong> {data.objective}</span>
          </div>
        )}
        {data?.steps && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#004b71] uppercase tracking-tighter">Pasos:</span>
            {data.steps.map((step, si) => (
              <div key={si} className="flex items-start gap-3 text-sm text-[#40484f]">
                <span className="w-5 h-5 rounded-full bg-[#004b71]/10 text-[#004b71] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {si + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
        {data?.materials && (
          <div className="flex items-start gap-2 text-sm text-[#40484f]">
            <BookMarked size={16} className="text-[#004b71] mt-0.5 shrink-0" />
            <span><strong>Materiales:</strong> {data.materials}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);
