'use client';

import React from 'react';
import { Task, TaskStatus } from '@/features/tasks/taskTypes';
import { useUpdateTaskMutation } from '@/features/tasks/taskApi';
import { useToast } from '@/components/common/Toast';
import { Loader2 } from 'lucide-react';

interface TaskStatusDropdownProps {
  task: Task;
}

export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({ task }) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const { showToast } = useToast();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    if (newStatus === task.status) return;

    try {
      await updateTask({
        id: task.id,
        projectId: task.projectId,
        status: newStatus,
      }).unwrap();
      const statusLabel =
        newStatus === 'DONE'
          ? 'Completed'
          : newStatus === 'IN_PROGRESS'
          ? 'In Progress'
          : 'To Do';
      showToast(`Task status updated to "${statusLabel}"`, 'success');
    } catch {
      showToast('Failed to update task status', 'error');
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={task.status}
        onChange={handleStatusChange}
        disabled={isLoading}
        className={`text-[11px] font-semibold rounded-lg pl-2 pr-6 py-1 cursor-pointer border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 appearance-none ${
          task.status === 'DONE'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : task.status === 'IN_PROGRESS'
            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
        }`}
        title="Change task status directly"
      >
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <div className="pointer-events-none absolute right-1.5 flex items-center">
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
        ) : (
          <svg
            className="w-3 h-3 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
    </div>
  );
};
