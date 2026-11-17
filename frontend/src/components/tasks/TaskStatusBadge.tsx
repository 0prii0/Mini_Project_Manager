'use client';

import React from 'react';
import { TaskStatus } from '@/features/tasks/taskTypes';
import { Clock, CheckCircle2, CircleDot } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm
    ? 'px-2 py-0.5 text-[11px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5';

  switch (status) {
    case 'TODO':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-md bg-amber-50 text-[#D97706] border border-amber-200/80 ${sizeClasses}`}
        >
          <CircleDot className={isSm ? 'w-3 h-3 text-[#D97706]' : 'w-3.5 h-3.5 text-[#D97706]'} />
          To Do
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-md bg-blue-50 text-[#2563EB] border border-blue-200/80 ${sizeClasses}`}
        >
          <Clock className={isSm ? 'w-3 h-3 text-[#2563EB]' : 'w-3.5 h-3.5 text-[#2563EB]'} />
          In Progress
        </span>
      );
    case 'DONE':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-md bg-emerald-50 text-[#059669] border border-emerald-200/80 ${sizeClasses}`}
        >
          <CheckCircle2 className={isSm ? 'w-3 h-3 text-[#059669]' : 'w-3.5 h-3.5 text-[#059669]'} />
          Done
        </span>
      );
    default:
      return null;
  }
};
