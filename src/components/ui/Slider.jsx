import React from 'react';
import { cn } from '../../utils/cn';

export const Slider = ({ value, onChange, min = 0, max = 100, step = 1, className }) => {
  return (
    <div className={cn("relative w-full h-6 flex items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
};
