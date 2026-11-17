'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/features/projects/projectTypes';
import {
  FolderKanban,
  Calendar,
  ArrowRight,
  Edit2,
  Trash2,
  CheckSquare,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const taskCount = project._count?.tasks ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)] hover:border-[#CBD5E1] transition-all flex flex-col justify-between group">
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/60 text-[#4F46E5] flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white transition-all flex-shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#4F46E5] hover:bg-indigo-50 transition-colors"
              title="Edit project"
              aria-label={`Edit ${project.title}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#DC2626] hover:bg-red-50 transition-colors"
              title="Delete project"
              aria-label={`Delete ${project.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <Link href={`/projects/${project.id}`}>
            <h3 className="font-bold font-heading text-[#0F172A] text-base group-hover:text-[#4F46E5] transition-colors tracking-tight line-clamp-1">
              {project.title}
            </h3>
          </Link>
          <p className="text-[13px] leading-[20px] text-[#475569] line-clamp-2 min-h-[2.5rem]">
            {project.description || (
              <span className="italic text-[#94A3B8]">No description provided</span>
            )}
          </p>
        </div>
      </div>

      <div className="pt-3.5 mt-3.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5 font-medium text-[#64748B]">
          <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] border border-indigo-100/60">
            <CheckSquare className="w-3 h-3 text-[#4F46E5]" />
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>
          <Link
            href={`/projects/${project.id}`}
            className="p-1 text-[#94A3B8] group-hover:text-[#4F46E5] transition-colors"
            title="Open workspace"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
