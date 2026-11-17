'use client';

import React from 'react';
import { TaskCounts, TaskStatus } from '@/features/tasks/taskTypes';
import {
  Search,
  SlidersHorizontal,
  Calendar,
  X,
} from 'lucide-react';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'ALL' | TaskStatus;
  onStatusChange: (status: 'ALL' | TaskStatus) => void;
  dateFilter: 'ALL' | 'OVERDUE' | 'TODAY' | 'UPCOMING' | 'CUSTOM';
  onDateFilterChange: (filter: 'ALL' | 'OVERDUE' | 'TODAY' | 'UPCOMING' | 'CUSTOM') => void;
  dueDateFrom: string;
  onDueDateFromChange: (val: string) => void;
  dueDateTo: string;
  onDueDateToChange: (val: string) => void;
  sortBy: 'dueDate' | 'status' | 'createdAt' | 'title';
  onSortByChange: (sortBy: 'dueDate' | 'status' | 'createdAt' | 'title') => void;
  order: 'asc' | 'desc';
  onOrderChange: (order: 'asc' | 'desc') => void;
  counts: TaskCounts;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
  dueDateFrom,
  onDueDateFromChange,
  dueDateTo,
  onDueDateToChange,
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
  counts,
}) => {
  const statusTabs: Array<{ id: 'ALL' | TaskStatus; label: string; count: number }> = [
    { id: 'ALL', label: 'All Tasks', count: counts.total },
    { id: 'TODO', label: 'To Do', count: counts.todo },
    { id: 'IN_PROGRESS', label: 'In Progress', count: counts.inProgress },
    { id: 'DONE', label: 'Done', count: counts.done },
  ];

  return (
    <div className="bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/20 rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Row: Status Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or details..."
            className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Due Date Filter & Sorting Controls */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-slate-500 font-semibold inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Due Date:
          </span>
          <select
            value={dateFilter}
            onChange={(e) =>
              onDateFilterChange(
                e.target.value as 'ALL' | 'OVERDUE' | 'TODAY' | 'UPCOMING' | 'CUSTOM'
              )
            }
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          >
            <option value="ALL">All Dates</option>
            <option value="OVERDUE">⚠️ Overdue</option>
            <option value="TODAY">🕒 Due Today</option>
            <option value="UPCOMING">📅 Upcoming</option>
            <option value="CUSTOM">📆 Custom Range</option>
          </select>

          {dateFilter === 'CUSTOM' && (
            <div className="flex items-center gap-1.5 animate-in fade-in">
              <input
                type="date"
                value={dueDateFrom}
                onChange={(e) => onDueDateFromChange(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="From date"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={dueDateTo}
                onChange={(e) => onDueDateToChange(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="To date"
              />
            </div>
          )}
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold inline-flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortByChange(
                e.target.value as 'dueDate' | 'status' | 'createdAt' | 'title'
              )
            }
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date (Nulls Last)</option>
            <option value="status">Status (TODO → DONE)</option>
            <option value="title">Title (Alphabetical)</option>
          </select>

          <select
            value={order}
            onChange={(e) => onOrderChange(e.target.value as 'asc' | 'desc')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          >
            <option value="asc">Ascending ↑</option>
            <option value="desc">Descending ↓</option>
          </select>
        </div>
      </div>
    </div>
  );
};
