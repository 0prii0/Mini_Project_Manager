'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Layers,
  LayoutDashboard,
  FolderKanban,
  LogOut,
} from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { useLogoutUserMutation } from '@/features/auth/authApi';
import { useToast } from '@/components/common/Toast';

interface SidebarProps {
  onLinkClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      showToast('Logged out successfully', 'info');
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const navLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard',
    },
    {
      name: 'My Projects',
      href: '/projects',
      icon: FolderKanban,
      isActive: pathname.startsWith('/projects'),
    },
  ];

  return (
    <aside className="h-full w-[280px] bg-gradient-to-b from-[#101B4B] via-[#0D153A] to-[#1E1B4B] text-white flex flex-col justify-between select-none relative overflow-hidden border-r border-white/5">
      {/* Subtle indigo ambient gradient glow at bottom */}
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-0 w-48 h-48 rounded-full bg-indigo-600/15 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Branding & Navigation */}
      <div className="relative z-10">
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center border-b border-white/10">
          <Link
            href="/dashboard"
            onClick={onLinkClick}
            className="flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105 flex-shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-[15px] font-heading tracking-tight block leading-snug">
                Mini Project Manager
              </span>
              <span className="text-[11px] font-medium text-[#C7D2FE] block">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-1.5">
          <p className="px-3 pt-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#818CF8]">
            Overview
          </p>

          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-150 ${
                  link.isActive
                    ? 'bg-[#5145E5] text-white shadow-lg shadow-indigo-600/30'
                    : 'text-[#C7D2FE] hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${link.isActive ? 'text-white' : 'text-[#C7D2FE]'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 space-y-3 relative z-10 border-t border-white/10">
        {user && (
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#5145E5] text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-600/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#101B4B]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-white truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-[#C7D2FE] truncate mt-0.5" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#C7D2FE] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
