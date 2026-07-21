import React from 'react';

export const LoadingSkeleton = () => (
  <div className="flex h-[calc(100vh-100px)]">
    <div className="w-80 bg-surface-container-low border-r border-outline-variant/10 p-6 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-12 bg-surface-container-high rounded-xl animate-pulse" />
      ))}
    </div>
    <div className="flex-grow p-12 space-y-6">
      <div className="w-1/2 h-8 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-64 bg-surface-container-lowest rounded-3xl animate-pulse border" />
    </div>
  </div>
);
