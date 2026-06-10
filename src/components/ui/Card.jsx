import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Card = ({ className, children, animate = true, delay = 0, ...props }) => {
  const content = (
    <div 
      className={cn(
        "glass-card p-6 rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {content}
    </motion.div>
  );
};
