'use client';

import React from 'react';
import { Task } from '@/features/tasks/taskTypes';
import { useDeleteTaskMutation } from '@/features/tasks/taskApi';
import { useToast } from '@/components/common/Toast';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteTaskDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  task,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();
  const { showToast } = useToast();

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    try {
      await deleteTask({ id: task.id, projectId: task.projectId }).unwrap();
      showToast('Task deleted successfully', 'success');
      onClose();
      if (onDeleted) onDeleted();
    } catch (_err) {
      // Handled by RTK Query
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-task-dialog-title"
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="delete-task-dialog-title" className="text-base font-bold text-slate-900">
              Delete Task
            </h3>
            <p className="text-xs text-slate-500">Confirm permanent task removal</p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-5 text-xs text-slate-600 space-y-2">
          <p>
            Are you sure you want to delete{' '}
            <span className="font-bold text-slate-900">"{task.title}"</span>?
          </p>
          <p className="text-rose-600 font-medium">
            ⚠️ This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Trash2 className="w-3.5 h-3.5" />
            {isLoading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};
