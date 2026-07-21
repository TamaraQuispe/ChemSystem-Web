import React from 'react';
import { FileText } from 'lucide-react';

export const CaseStudyCard = ({ data }) => (
  <div className="col-span-12 md:col-span-6">
    <div className="bg-[#faf5ff] border border-[#6c228c]/20 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={18} className="text-[#6c228c]" />
        <span className="text-sm font-bold text-[#6c228c] uppercase tracking-tighter">Caso de Estudio</span>
      </div>
      <p className="text-sm text-[#40484f] leading-relaxed">{data?.content}</p>
      {data?.questions && (
        <div className="mt-4 space-y-2">
          <span className="text-xs font-bold text-[#6c228c] uppercase tracking-tighter">Preguntas de reflexión:</span>
          {data.questions.map((q, qi) => (
            <p key={qi} className="text-sm text-[#40484f] pl-4 border-l-2 border-[#6c228c]/30">
              {qi + 1}. {q}
            </p>
          ))}
        </div>
      )}
    </div>
  </div>
);
