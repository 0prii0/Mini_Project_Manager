'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, LayoutDashboard } from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';

export const AuthHeroActions: React.FC = () => {
  const { isAuthenticated, user, isInitializing } = useAppSelector((state) => state.auth);

  if (isInitializing) {
    return (
      <div className="h-10 flex items-center justify-center">
        <span className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <LayoutDashboard className="w-4 h-4" />
          Go to Workspace Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
      <Link
        href="/signup"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>Get Started Free</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm transition-all"
      >
        <Lock className="w-4 h-4 text-slate-400" />
        Sign In
      </Link>
    </div>
  );
};
