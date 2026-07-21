import React from 'react';

export const LessonSkeleton = () => (
  <div className="space-y-6 max-w-5xl">
    <div className="w-1/2 h-8 bg-gray-200 rounded-lg animate-pulse" />
    <div className="h-96 bg-white rounded-3xl animate-pulse border" />
  </div>
);
