'use client';

import React from 'react';
import { Task } from '@/features/tasks/taskTypes';
import { TaskDueDateBadge } from './TaskDueDateBadge';
import { TaskStatusDropdown } from './TaskStatusDropdown';
import { Edit2, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
}) => {
  const isDone = task.status === 'DONE';
  const isInProgress = task.status === 'IN_PROGRESS';

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group ${
        isDone
          ? 'bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 border-emerald-200/90 hover:border-emerald-300'
          : isInProgress
          ? 'bg-gradient-to-br from-white via-blue-50/30 to-sky-50/20 border-blue-200/80 hover:border-blue-300'
          : 'bg-gradient-to-br from-white via-slate-50/40 to-indigo-50/20 border-slate-200/90 hover:border-indigo-300'
      }`}
    >
      <div className="space-y-3">
        {/* Header row: Status Dropdown & Action buttons */}
        <div className="flex items-center justify-between gap-2">
          <TaskStatusDropdown task={task} />

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit task"
              aria-label={`Edit ${task.title}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete task"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h4
            className={`font-bold text-sm tracking-tight leading-snug ${
              isDone ? 'line-through text-slate-400' : 'text-slate-900'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer row: Due date badge */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <TaskDueDateBadge dueDate={task.dueDate} status={task.status} />

        <span className="text-[11px] text-slate-400 font-medium">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
