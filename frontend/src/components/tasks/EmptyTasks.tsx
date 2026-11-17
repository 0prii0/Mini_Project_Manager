'use client';

import React from 'react';
import { Plus, SlidersHorizontal, CheckSquare } from 'lucide-react';

interface EmptyTasksProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
  onCreateTask?: () => void;
}

export const EmptyTasks: React.FC<EmptyTasksProps> = ({
  isFiltered = false,
  onResetFilters,
  onCreateTask,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-white via-indigo-50/20 to-indigo-50/10 rounded-3xl border border-dashed border-indigo-200 my-4 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-100 to-indigo-200 flex items-center justify-center mb-4 text-indigo-600 shadow-inner">
        {isFiltered ? (
          <SlidersHorizontal className="w-7 h-7" />
        ) : (
          <CheckSquare className="w-7 h-7" />
        )}
      </div>

      <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-1">
        {isFiltered ? 'No tasks match your filters' : 'No tasks created yet'}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {isFiltered
          ? 'Try clearing your status or due date filters to view all tasks.'
          : 'Break down your project into manageable tasks, assign due dates, and track real-time progress.'}
      </p>

      <div className="flex items-center gap-3">
        {isFiltered && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
          >
            Reset Filters
          </button>
        )}

        {onCreateTask && (
          <button
            type="button"
            onClick={onCreateTask}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            Add First Task
          </button>
        )}
      </div>
    </div>
  );
};
