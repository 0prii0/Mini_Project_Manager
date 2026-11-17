import React from 'react';

export const ProjectSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-slate-200 rounded-xl" />
            <div className="w-16 h-5 bg-slate-200 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
            <div className="w-full h-4 bg-slate-100 rounded-md" />
            <div className="w-2/3 h-4 bg-slate-100 rounded-md" />
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="w-24 h-4 bg-slate-100 rounded-md" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
