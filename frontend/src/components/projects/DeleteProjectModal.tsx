'use client';

import React from 'react';
import { Project } from '@/features/projects/projectTypes';
import { useDeleteProjectMutation } from '@/features/projects/projectApi';
import { useToast } from '@/components/common/Toast';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();
  const { showToast } = useToast();

  if (!isOpen || !project) return null;

  const handleDelete = async () => {
    try {
      await deleteProject(project.id).unwrap();
      showToast('Project deleted successfully', 'success');
      onClose();
      if (onDeleted) onDeleted();
    } catch (_err) {
      // Handled by RTK Query error state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E2E8F0]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-rose-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="text-base font-bold font-heading text-[#101828]">
              Delete Project
            </h3>
            <p className="text-xs text-[#64748B]">Permanent destruction warning</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5 text-xs text-[#475569] space-y-2">
          <p>
            Are you sure you want to delete{' '}
            <span className="font-bold text-[#101828]">&quot;{project.title}&quot;</span>?
          </p>
          <p className="text-rose-600 font-semibold">
            ⚠️ This action cannot be undone. All associated tasks under this project will also be permanently deleted.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 text-xs font-semibold text-[#475569] hover:text-[#101828] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Trash2 className="w-3.5 h-3.5" />
            {isLoading ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </div>
  );
};
