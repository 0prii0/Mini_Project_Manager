'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';
import { useGetDashboardQuery } from '@/features/dashboard/dashboardApi';
import { DashboardRecentProject, DashboardRecentTask } from '@/features/dashboard/dashboardTypes';
import { Project } from '@/features/projects/projectTypes';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { EditProjectModal } from '@/components/projects/EditProjectModal';
import { DeleteProjectModal } from '@/components/projects/DeleteProjectModal';
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge';
import { TaskDueDateBadge } from '@/components/tasks/TaskDueDateBadge';
import { useToast } from '@/components/common/Toast';
import {
  Folder,
  FolderKanban,
  CheckSquare,
  Clock3,
  CheckCircle2,
  Plus,
  ArrowRight,
  RefreshCw,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const DashboardContent: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, isFetching, error, refetch } = useGetDashboardQuery();
  const { showToast } = useToast();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }, []);

  const stats = data?.stats || {
    totalProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    completionRate: 0,
  };

  const recentProjects = data?.recentProjects || [];
  const recentTasks = data?.recentTasks || [];

  const handleRefresh = async () => {
    try {
      await refetch();
      showToast('Dashboard metrics updated', 'info');
    } catch {
      showToast('Failed to refresh dashboard', 'error');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* 1. Welcome Banner (Exact match to reference gradient & curves) */}
      <div className="relative rounded-[24px] overflow-hidden shadow-lg p-6 sm:p-8 min-h-[175px] flex flex-col justify-between"
        style={{
          background: 'linear-gradient(115deg, #172554 0%, #312E81 55%, #4338CA 100%)',
        }}
      >
        {/* Decorative curved waves on the right (matches reference image) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 pointer-events-none select-none overflow-hidden opacity-30"
          aria-hidden="true"
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 400 200"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M100 0 C 180 60, 220 140, 400 200 L 400 0 Z"
              fill="rgba(255, 255, 255, 0.12)"
            />
            <path
              d="M200 0 C 260 70, 300 130, 400 180 L 400 0 Z"
              fill="rgba(255, 255, 255, 0.08)"
            />
            <path
              d="M50 0 C 140 80, 240 120, 400 160 L 400 0 Z"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            {/* Date chip */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-white/15 border border-white/20 backdrop-blur-sm shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span suppressHydrationWarning>{currentDate || 'Tue, Nov 17, 2026'}</span>
            </div>

            {/* Main Greeting */}
            <h1 className="text-2xl sm:text-[30px] font-extrabold text-white font-heading tracking-tight leading-tight">
              Welcome back, {user?.name || 'Amit Kumar'}!
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-white/85 font-normal">
              Here&apos;s what&apos;s happening across your workspace.
            </p>
          </div>

          {/* Banner Actions */}
          <div className="flex items-center gap-3 relative z-10 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl backdrop-blur-sm transition-all shadow-sm disabled:opacity-50"
              title="Refresh dashboard metrics"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-white' : 'text-white'}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-[#172554] bg-white hover:bg-slate-50 rounded-xl transition-all shadow-lg shadow-black/15"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Five Colorful Pastel KPI Cards (Exact match to reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-4.5">
        {/* Card 1: Total Projects (Lavender pastel #F2EEFF) */}
        <div className="bg-[#F2EEFF] border border-[#DDD6FE] rounded-[22px] p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden h-[180px] hover:translate-y-[-2px] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold text-[#1E1B4B]">
              Total Projects
            </span>
          </div>

          <div>
            <p className="text-3xl sm:text-[38px] font-extrabold text-[#101828] font-heading tracking-tight leading-none">
              {isLoading ? '...' : stats.totalProjects}
            </p>
            <p className="text-xs text-[#64748B] mt-2">Active workspaces</p>
          </div>

          {/* Accent dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] absolute bottom-5 right-5" />
        </div>

        {/* Card 2: Total Tasks (Indigo tint #EEF2FF) */}
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-[22px] p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden h-[180px] hover:translate-y-[-2px] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#4338CA] text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold text-[#1E1B4B]">
              Total Tasks
            </span>
          </div>

          <div>
            <p className="text-3xl sm:text-[38px] font-extrabold text-[#101828] font-heading tracking-tight leading-none">
              {isLoading ? '...' : stats.totalTasks}
            </p>
            <p className="text-xs text-[#64748B] mt-2">Across all projects</p>
          </div>

          {/* Accent dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#4338CA] absolute bottom-5 right-5" />
        </div>

        {/* Card 3: Pending (Amber/Cream pastel #FFF8E8) */}
        <div className="bg-[#FFF8E8] border border-[#FDE68A] rounded-[22px] p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden h-[180px] hover:translate-y-[-2px] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shadow-md shadow-amber-500/25">
              <Clock3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold text-[#78350F]">
              Pending
            </span>
          </div>

          <div>
            <p className="text-3xl sm:text-[38px] font-extrabold text-[#101828] font-heading tracking-tight leading-none">
              {isLoading ? '...' : stats.todoTasks}
            </p>
            <p className="text-xs text-[#64748B] mt-2">Status: To Do</p>
          </div>

          {/* Accent dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] absolute bottom-5 right-5" />
        </div>

        {/* Card 4: In Progress (Sky/Blue pastel #EFF6FF) */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[22px] p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden h-[180px] hover:translate-y-[-2px] hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold text-[#1E3A8A]">
              In Progress
            </span>
          </div>

          <div>
            <p className="text-3xl sm:text-[38px] font-extrabold text-[#101828] font-heading tracking-tight leading-none">
              {isLoading ? '...' : stats.inProgressTasks}
            </p>
            <p className="text-xs text-[#64748B] mt-2">Actively working</p>
          </div>

          {/* Accent dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] absolute bottom-5 right-5" />
        </div>

        {/* Card 5: Completed (Mint/Emerald pastel #EAFBF5) */}
        <div className="bg-[#EAFBF5] border border-[#A7F3D0] rounded-[22px] p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden h-[180px] hover:translate-y-[-2px] hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold text-[#064E3B]">
              Completed
            </span>
          </div>

          <div>
            <p className="text-3xl sm:text-[38px] font-extrabold text-[#101828] font-heading tracking-tight leading-none">
              {isLoading ? '...' : stats.doneTasks}
            </p>
            <p className="text-xs text-[#64748B] mt-2">{stats.completionRate}% completion rate</p>
          </div>

          {/* Accent dot */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669] absolute bottom-5 right-5" />
        </div>
      </div>

      {/* 3. Main Content: My Projects (Lavender) & Recent Tasks (Teal) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
        {/* Left Column: My Projects (7 cols on lg, approx 58%) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#DDD6FE] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* Subtle lavender wave accent at bottom-left */}
          <div
            className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#EDE9FE]/40 pointer-events-none blur-3xl select-none"
            aria-hidden="true"
          />

          {/* Panel Header */}
          <div className="relative z-10 flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-[#C7D2FE] bg-indigo-50/70 text-[#4F46E5] flex items-center justify-center shadow-sm">
                <Folder className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-heading text-[#101828] leading-tight">
                  My Projects
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Workspaces you have recently updated
                </p>
              </div>
            </div>

            <Link
              href="/projects"
              className="text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline inline-flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Content Area: Empty State or Populated Project List */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-50 rounded-2xl border border-slate-100 p-4" />
                ))}
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50/50 rounded-2xl border border-red-200 text-center space-y-2">
                <AlertCircle className="w-6 h-6 mx-auto text-[#DC2626]" />
                <p className="text-sm font-semibold text-[#DC2626]">Failed to load recent projects</p>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="text-xs text-[#4F46E5] underline font-semibold"
                >
                  Try refreshing
                </button>
              </div>
            ) : recentProjects.length === 0 ? (
              /* Exact match to the reference image empty state */
              <div className="py-8 px-4 text-center space-y-4 my-auto">
                {/* Indigo Folder Illustration with Sparkles */}
                <div className="relative inline-block mx-auto">
                  {/* Sparkle decorative dashes */}
                  <div className="absolute -top-3 -right-3 text-[#4F46E5] text-xs font-bold select-none opacity-80">
                    ✦ ᐟ
                  </div>
                  <div className="absolute -top-2 -left-2 text-[#6366F1] text-xs font-bold select-none opacity-80">
                    ᐟ
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] border-2 border-[#C7D2FE] text-[#4F46E5] flex items-center justify-center shadow-sm">
                    <Folder className="w-8 h-8 stroke-[1.8]" />
                  </div>
                </div>

                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-lg font-bold font-heading text-[#101828]">
                    No projects yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    Create your first project and start organizing your work.
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Project</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Populated list */
              <div className="space-y-3">
                {recentProjects.map((project: DashboardRecentProject) => (
                  <div
                    key={project.id}
                    className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4 hover:border-[#DDD6FE] hover:bg-white hover:shadow-sm transition-all group flex items-center justify-between gap-4"
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-start gap-3.5 min-w-0 flex-1"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#4F46E5] group-hover:text-white transition-all">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[15px] font-bold font-heading text-[#101828] group-hover:text-[#4F46E5] transition-colors truncate">
                          {project.title}
                        </h4>
                        <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5">
                          {project.description || <span className="italic text-[#94A3B8]">No description provided</span>}
                        </p>
                        <div className="flex items-center gap-2.5 mt-2 text-[11px] text-[#64748B]">
                          <span className="font-semibold text-[#4F46E5] bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                            {project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'}
                          </span>
                          <span>•</span>
                          <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={`/projects/${project.id}`}
                      className="p-2 rounded-xl text-[#94A3B8] hover:text-[#4F46E5] hover:bg-indigo-50 transition-colors flex-shrink-0"
                      title="Open workspace"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Tasks (5 cols on lg, approx 42%) */}
        <div className="lg:col-span-5 bg-white rounded-[24px] border border-[#CCFBF1] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* Subtle teal wave accent at bottom-right */}
          <div
            className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-[#CCFBF1]/40 pointer-events-none blur-3xl select-none"
            aria-hidden="true"
          />

          {/* Panel Header */}
          <div className="relative z-10 flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-[#99F6E4] bg-teal-50/70 text-[#0F9F91] flex items-center justify-center shadow-sm">
                <CheckSquare className="w-5 h-5 text-[#0F9F91]" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-heading text-[#101828] leading-tight">
                  Recent Tasks
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Latest task activity across projects
                </p>
              </div>
            </div>
          </div>

          {/* Content Area: Empty State or Populated Task List */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-50 rounded-2xl border border-slate-100 p-4" />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              /* Exact match to the reference image empty state */
              <div className="py-8 px-4 text-center space-y-3 my-auto">
                {/* Teal Checklist/Clipboard Illustration with Sparkles */}
                <div className="relative inline-block mx-auto">
                  {/* Sparkle dashes */}
                  <div className="absolute -top-3 -right-3 text-[#0F9F91] text-xs font-bold select-none opacity-80">
                    ✦ ᐟ
                  </div>
                  <div className="absolute -top-2 -left-2 text-[#14B8A6] text-xs font-bold select-none opacity-80">
                    ᐟ
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-[#CCFBF1] border-2 border-[#99F6E4] text-[#0F9F91] flex items-center justify-center shadow-sm">
                    <CheckSquare className="w-8 h-8 stroke-[1.8]" />
                  </div>
                </div>

                <div className="space-y-1 max-w-xs mx-auto">
                  <h3 className="text-lg font-bold font-heading text-[#101828]">
                    No tasks to display
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    Tasks from your projects will appear here.
                  </p>
                </div>
              </div>
            ) : (
              /* Populated task list */
              <div className="space-y-2.5">
                {recentTasks.map((task: DashboardRecentTask) => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-200/80 hover:border-[#99F6E4] hover:bg-white hover:shadow-sm transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/projects/${task.projectId}`}
                        className="text-[11px] font-semibold text-[#5145E5] hover:underline truncate max-w-[170px]"
                        title={task.projectTitle}
                      >
                        📁 {task.projectTitle}
                      </Link>
                      <TaskStatusBadge status={task.status} size="sm" />
                    </div>

                    <h4 className="text-xs font-semibold text-[#101828] leading-snug line-clamp-2">
                      {task.title}
                    </h4>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#64748B]">
                      <TaskDueDateBadge dueDate={task.dueDate} status={task.status} />
                      <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditProjectModal
        project={editingProject}
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
      />

      <DeleteProjectModal
        project={deletingProject}
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
      />
    </div>
  );
};

export default DashboardContent;
