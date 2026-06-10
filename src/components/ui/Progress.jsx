import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Progress = ({ value = 0, max = 100, className, barClassName }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("h-2 w-full bg-gray-100 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn("h-full bg-primary", barClassName)}
      />
    </div>
  );
};
