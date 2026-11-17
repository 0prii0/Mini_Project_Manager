'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGetProjectByIdQuery } from '@/features/projects/projectApi';
import { useGetTasksQuery } from '@/features/tasks/taskApi';
import { Task, TaskStatus } from '@/features/tasks/taskTypes';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EditProjectModal } from '@/components/projects/EditProjectModal';
import { DeleteProjectModal } from '@/components/projects/DeleteProjectModal';
import {
  TaskCard,
  TaskFilters,
  CreateTaskModal,
  EditTaskModal,
  DeleteTaskDialog,
  EmptyTasks,
  TaskSkeleton,
} from '@/components/tasks';
import {
  FolderKanban,
  Calendar,
  Clock,
  ArrowLeft,
  Edit2,
  Trash2,
  CheckSquare,
  AlertCircle,
  Plus,
  CheckCircle2,
  Clock3,
  CircleDashed,
} from 'lucide-react';

interface ProjectDetailsContentProps {
  projectId: string;
}

export function ProjectDetailsContent({ projectId }: ProjectDetailsContentProps) {
  const router = useRouter();

  // Project Query
  const { data: projectData, isLoading: isProjectLoading, error: projectError } = useGetProjectByIdQuery(projectId);
  const project = projectData?.project;

  // Project Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Task Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'OVERDUE' | 'TODAY' | 'UPCOMING' | 'CUSTOM'>('ALL');
  const [dueDateFrom, setDueDateFrom] = useState('');
  const [dueDateTo, setDueDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'status' | 'createdAt' | 'title'>('dueDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Task Modal State
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Client-side date formatting state to prevent hydration mismatches
  const [formattedCreated, setFormattedCreated] = useState('');
  const [formattedUpdated, setFormattedUpdated] = useState('');

  useEffect(() => {
    if (project) {
      setFormattedCreated(
        new Date(project.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
      setFormattedUpdated(
        new Date(project.updatedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }
  }, [project]);

  // Tasks Query
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isFetching: isTasksFetching,
    error: tasksError,
  } = useGetTasksQuery(
    {
      projectId,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      dateFilter:
        dateFilter === 'ALL' || dateFilter === 'CUSTOM'
          ? undefined
          : dateFilter,
      dueDateFrom: dateFilter === 'CUSTOM' && dueDateFrom ? dueDateFrom : undefined,
      dueDateTo: dateFilter === 'CUSTOM' && dueDateTo ? dueDateTo : undefined,
      sortBy,
      order,
    },
    { skip: !projectId }
  );

  const rawTasks = tasksData?.tasks || [];
  const counts = tasksData?.counts || { total: 0, todo: 0, inProgress: 0, done: 0 };

  // Filter tasks client-side by search query if specified
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return rawTasks;
    const query = searchQuery.toLowerCase().trim();
    return rawTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
    );
  }, [rawTasks, searchQuery]);

  const hasActiveFilters =
    statusFilter !== 'ALL' ||
    dateFilter !== 'ALL' ||
    searchQuery.trim() !== '' ||
    dueDateFrom !== '' ||
    dueDateTo !== '';

  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setDateFilter('ALL');
    setSearchQuery('');
    setDueDateFrom('');
    setDueDateTo('');
    setSortBy('dueDate');
    setOrder('asc');
  };

  const completionPct =
    counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Projects
        </Link>
      </div>

          {
            isProjectLoading?(
          <div className = "bg-white rounded-2xl border border-slate-200 p-8 shadow-sm animate-pulse space-y-6" >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <div className="w-1/3 h-6 bg-slate-200 rounded-md" />
                <div className="w-1/4 h-4 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="w-full h-16 bg-slate-100 rounded-xl" />
          </div>
      ) : projectError || !project ? (
      <div className="p-12 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Project Not Found</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          This project does not exist or you do not have permission to access it. All projects are strictly isolated by owner.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
        >
          Return to Projects
        </Link>
      </div>
      ) : (
          <>
        {/* Project Header Banner */}
        <div className="bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-indigo-600/20">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm">
                  Active Workspace
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {project.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-start">
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl transition-all border border-slate-200 shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Project
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-xl transition-all border border-rose-200 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-white/80 rounded-2xl border border-slate-200/80 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {project.description || (
                <span className="italic text-slate-400">No description provided for this project.</span>
              )}
            </p>
          </div>

          {/* Progress and Task Metrics Bar with Gradient Accent Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-white via-indigo-50/50 to-indigo-100/30 p-4 rounded-2xl border border-indigo-200/80 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Tasks</p>
                <p className="text-xl font-extrabold text-slate-900">{counts.total}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white via-amber-50/50 to-amber-100/30 p-4 rounded-2xl border border-amber-200/80 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <CircleDashed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">To Do</p>
                <p className="text-xl font-extrabold text-amber-600">{counts.todo}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white via-blue-50/50 to-sky-100/30 p-4 rounded-2xl border border-blue-200/80 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Clock3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">In Progress</p>
                <p className="text-xl font-extrabold text-blue-600">{counts.inProgress}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white via-emerald-50/50 to-teal-100/30 p-4 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completed</p>
                <p className="text-xl font-extrabold text-emerald-600">
                  {counts.done} ({completionPct}%)
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {counts.total > 0 && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Overall Project Progress</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                  {completionPct}% Complete
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Metadata Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                Created: <strong className="text-slate-700">{formattedCreated}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>
                Last Updated: <strong className="text-slate-700">{formattedUpdated}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Task Management Section (Phase 4 Full Implementation) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    Tasks & Deliverables
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                        {counts.total} {counts.total === 1 ? 'task' : 'tasks'}
                      </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage tasks, update status, track deadlines, and organize workflow.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateTaskOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

              {/* Filters & Search */}
              <TaskFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                dueDateFrom={dueDateFrom}
                onDueDateFromChange={setDueDateFrom}
                dueDateTo={dueDateTo}
                onDueDateToChange={setDueDateTo}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                order={order}
                onOrderChange={setOrder}
                counts={counts}
              />

                {/* Tasks Content List */}
                {isTasksLoading ? (
                  <TaskSkeleton />
                ) : tasksError ? (
                <div className="p-8 text-center bg-rose-50 rounded-xl border border-rose-200 text-rose-700 space-y-2">
                  <AlertCircle className="w-6 h-6 mx-auto text-rose-500" />
                  <p className="text-sm font-semibold">Failed to load tasks</p>
                  <p className="text-xs text-rose-600">Please try refreshing the page or check your connection.</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <EmptyTasks
                  isFiltered={hasActiveFilters}
                  onResetFilters={handleResetFilters}
                  onCreateTask={() => setIsCreateTaskOpen(true)}
                />
              ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${isTasksFetching ? 'opacity-60' : 'opacity-100'}`}>
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={(t) => setEditingTask(t)}
                      onDelete={(t) => setDeletingTask(t)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Edit Project Modal */}
          {project && (
            <EditProjectModal
              project={project}
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
            />
          )}

          {/* Delete Project Modal */}
          {project && (
            <DeleteProjectModal
              project={project}
              isOpen={isDeleteOpen}
              onClose={() => setIsDeleteOpen(false)}
              onDeleted={() => router.push('/projects')}
            />
          )}

          {/* Create Task Modal */}
          <CreateTaskModal
            projectId={projectId}
            isOpen={isCreateTaskOpen}
            onClose={() => setIsCreateTaskOpen(false)}
          />

          {/* Edit Task Modal */}
          <EditTaskModal
            task={editingTask}
            isOpen={!!editingTask}
            onClose={() => setEditingTask(null)}
          />

          {/* Delete Task Dialog */}
          <DeleteTaskDialog
            task={deletingTask}
            isOpen={!!deletingTask}
            onClose={() => setDeletingTask(null)}
          />
        </div>
      );
}
