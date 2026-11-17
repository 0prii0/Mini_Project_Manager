'use client';

import React from 'react';
import { TaskStatus } from '@/features/tasks/taskTypes';
import { Calendar, AlertCircle, Clock, Check } from 'lucide-react';

interface TaskDueDateBadgeProps {
  dueDate: string | null;
  status: TaskStatus;
}

export const TaskDueDateBadge: React.FC<TaskDueDateBadgeProps> = ({
  dueDate,
  status,
}) => {
  if (!dueDate) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#94A3B8]">
        <Calendar className="w-3.5 h-3.5 text-[#CBD5E1]" />
        No due date
      </span>
    );
  }

  const due = new Date(dueDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const formattedDate = due.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: due.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });

  const isDone = status === 'DONE';
  const isOverdue = !isDone && due < startOfToday;
  const isDueToday = !isDone && due >= startOfToday && due <= endOfToday;

  if (isDone) {
    return (
      <span
        suppressHydrationWarning
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-[#64748B] border border-slate-200/80"
      >
        <Check className="w-3 h-3 text-[#059669]" />
        Completed ({formattedDate})
      </span>
    );
  }

  if (isOverdue) {
    return (
      <span
        suppressHydrationWarning
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-[#DC2626] border border-red-200/80"
      >
        <AlertCircle className="w-3 h-3 text-[#DC2626]" />
        Overdue ({formattedDate})
      </span>
    );
  }

  if (isDueToday) {
    return (
      <span
        suppressHydrationWarning
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-[#D97706] border border-amber-200/80"
      >
        <Clock className="w-3 h-3 text-[#D97706]" />
        Due Today
      </span>
    );
  }

  return (
    <span
      suppressHydrationWarning
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-[#64748B] border border-slate-200/80"
    >
      <Calendar className="w-3 h-3 text-[#64748B]" />
      Due {formattedDate}
    </span>
  );
};
