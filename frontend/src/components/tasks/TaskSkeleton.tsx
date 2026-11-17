'use client';

import React from 'react';

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 bg-gray-200 rounded-full" />
            <div className="flex gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-3.5 w-full bg-gray-200 rounded" />
            <div className="h-3.5 w-2/3 bg-gray-200 rounded" />
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
