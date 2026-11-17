'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import {
  ArrowRight,
  FolderKanban,
  CheckSquare,
  Clock,
  Sparkles,
  Loader2,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);

  // Authenticated user redirect: automatically forward to /dashboard
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isInitializing, router]);

  // While validating session, show clean subtle loading state to prevent UI flashes
  if (isInitializing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" />
        <p className="text-sm font-medium text-[#64748B]">Loading workspace...</p>
      </div>
    );
  }

  // If already authenticated, show redirect indicator
  if (isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" />
        <p className="text-sm font-medium text-[#64748B]">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col justify-between relative overflow-hidden bg-[#F3F6FF]">
      {/* Subtle ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-indigo-100/30 to-blue-200/20 blur-3xl rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center my-auto">
        {/* Top Product Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] border border-indigo-100 shadow-sm mb-6 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
          <span>Project &amp; Task Management Workspace</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-[#0F172A] tracking-tight leading-[1.15]">
          Manage Your Projects{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 bg-clip-text text-transparent">
            Smarter
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed mt-5">
          Organize projects, track tasks, manage deadlines and stay productive with your personal project management workspace.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-10">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-[#0F172A] bg-white hover:bg-slate-50 border border-[#CBD5E1] shadow-sm hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
          >
            <Lock className="w-4 h-4 text-[#64748B]" />
            <span>Login</span>
          </Link>
        </div>

        {/* User-facing Core Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 max-w-4xl mx-auto text-left">
          {/* Feature 1 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#DDD6FE] p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mb-4">
              <FolderKanban className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-heading text-[#0F172A] text-base mb-1">
              Project Workspaces
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Create and manage isolated project environments with real-time tracking.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mb-4">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-heading text-[#0F172A] text-base mb-1">
              Task Tracking
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Organize deliverables across clear TODO, In Progress, and Completed states.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#CCFBF1] p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-[#0F766E] flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-heading text-[#0F172A] text-base mb-1">
              Deadlines &amp; Status
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Stay ahead of milestones with instant due date tracking and priority indicators.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/60 text-center text-xs text-[#64748B]">
        <p>&copy; {new Date().getFullYear()} Mini Project Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
