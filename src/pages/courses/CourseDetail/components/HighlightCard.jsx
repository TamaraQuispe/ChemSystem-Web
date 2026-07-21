import React from 'react';
import { Lightbulb } from 'lucide-react';
import { cn } from '../../../../utils/cn';

export const HighlightCard = ({ text, variant }) => (
  <div className={cn(
    'col-span-12 md:col-span-5 p-6 rounded-2xl border-l-4 text-sm flex items-start gap-3',
    variant === 'warning'
      ? 'bg-[#ffdad6]/30 border-[#ba1a1a]'
      : 'bg-[#cbe6ff]/30 border-[#004b71]'
  )}>
    <Lightbulb
      size={20}
      className={cn(
        'shrink-0 mt-0.5',
        variant === 'warning' ? 'text-[#ba1a1a]' : 'text-[#004b71]'
      )}
    />
    <div>
      <span className="font-bold text-xs uppercase tracking-tighter text-[#40484f] mb-1 block">
        {variant === 'warning' ? '⚠ Atención' : '💡 Concepto Clave'}
      </span>
      <span className="font-medium text-[#40484f]">{text}</span>
    </div>
  </div>
);
