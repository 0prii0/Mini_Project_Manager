'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/features/tasks/taskTypes';
import { useUpdateTaskMutation } from '@/features/tasks/taskApi';
import { useToast } from '@/components/common/Toast';
import { X, Edit3, Loader2, AlertCircle, CalendarX } from 'lucide-react';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [dueDate, setDueDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [updateTask, { isLoading, error }] = useUpdateTaskMutation();
  const { showToast } = useToast();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      );
      setValidationError(null);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setValidationError('Task title is required and cannot be empty.');
      return;
    }

    try {
      await updateTask({
        id: task.id,
        projectId: task.projectId,
        title: trimmedTitle,
        description: description.trim() || null,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      }).unwrap();

      showToast('Task updated successfully', 'success');
      onClose();
    } catch (_err) {
      // Handled by RTK Query
    }
  };

  const handleClearDueDate = () => {
    setDueDate('');
  };

  const errorMessage =
    validationError ||
    (error && 'data' in error && (error.data as any)?.message) ||
    (error ? 'Failed to update task. Please try again.' : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 id="edit-task-title" className="text-lg font-bold text-slate-900">
              Edit Task
            </h3>
            <p className="text-xs text-slate-500">
              Update task progress, details and deadlines.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-task-title"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-task-title"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Task title..."
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-task-description"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="edit-task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description..."
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-task-status"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Status
              </label>
              <select
                id="edit-task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 font-medium text-slate-800"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="edit-task-due-date"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Due Date
                </label>
                {dueDate && (
                  <button
                    type="button"
                    onClick={handleClearDueDate}
                    className="text-[11px] font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1"
                  >
                    <CalendarX className="w-3 h-3" />
                    Clear date
                  </button>
                )}
              </div>
              <input
                id="edit-task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
