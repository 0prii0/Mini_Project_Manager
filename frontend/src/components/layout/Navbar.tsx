'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Layers, LogOut, LayoutDashboard, FolderKanban } from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { useLogoutUserMutation } from '@/features/auth/authApi';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitializing } = useAppSelector((state) => state.auth);
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  // Hide the standalone public navbar on authenticated AppLayout pages
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/projects')) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <header className="border-b border-[#E2E8F0] bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#172554] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold font-heading text-[#0F172A] text-base leading-tight tracking-tight">
              Mini Project Manager
            </h1>
            <p className="text-[11px] font-medium text-[#64748B]">Project &amp; Task Management Workspace</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {!isInitializing && (
            <>
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#475569] hover:text-[#0F172A] bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>

                  <Link
                    href="/projects"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <FolderKanban className="w-3.5 h-3.5" />
                    Projects
                  </Link>

                  <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
                    <div className="w-8 h-8 rounded-lg bg-[#172554] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="p-1.5 text-slate-400 hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-xs font-bold text-[#0F172A] hover:text-[#4F46E5] hover:bg-slate-100/80 rounded-xl transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
