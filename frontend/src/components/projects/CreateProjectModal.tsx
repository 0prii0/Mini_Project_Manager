'use client';

import React, { useState } from 'react';
import { useCreateProjectMutation } from '@/features/projects/projectApi';
import { useToast } from '@/components/common/Toast';
import { X, FolderPlus, Loader2, AlertCircle } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [createProject, { isLoading, error }] = useCreateProjectMutation();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setValidationError('Project title is required and cannot be empty.');
      return;
    }

    try {
      await createProject({
        title: trimmedTitle,
        description: description.trim() || undefined,
      }).unwrap();

      showToast('Project created successfully', 'success');
      setTitle('');
      setDescription('');
      onClose();
    } catch (_err) {
      // RTK Query error handled below
    }
  };

  const errorMessage =
    validationError ||
    (error && 'data' in error && (error.data as any)?.message) ||
    (error ? 'Failed to create project. Please try again.' : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-[24px] max-w-lg w-full shadow-2xl border border-[#E2E8F0] relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Lavender-tinted Header */}
        <div className="bg-[#F2EEFF] border-b border-[#DDD6FE] p-6 relative">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-5 right-5 text-[#64748B] hover:text-[#101828] p-1.5 rounded-xl hover:bg-white/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#5145E5] text-white flex items-center justify-center shadow-md shadow-indigo-500/25 flex-shrink-0">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-lg font-bold font-heading text-[#101828]">
                Create New Project
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Add a new workspace to organize your tasks.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="project-title"
                className="block text-xs font-semibold text-[#101828] mb-1.5"
              >
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="project-title"
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="e.g. Mobile App Redesign"
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#5145E5] focus:border-[#5145E5] transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="project-desc"
                className="block text-xs font-semibold text-[#101828] mb-1.5"
              >
                Description <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <textarea
                id="project-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief overview of project goals and objectives..."
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#CBD5E1] bg-white focus:outline-none focus:ring-2 focus:ring-[#5145E5] focus:border-[#5145E5] transition-all disabled:opacity-50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 text-xs font-semibold text-[#475569] hover:text-[#101828] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#5145E5] hover:bg-[#4338CA] rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
