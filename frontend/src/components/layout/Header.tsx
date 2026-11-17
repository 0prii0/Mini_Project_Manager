'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  Home,
  ChevronRight,
} from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { useLogoutUserMutation } from '@/features/auth/authApi';
import { BreadcrumbItem } from './Breadcrumbs';
import { useToast } from '@/components/common/Toast';

interface HeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Dashboard',
  breadcrumbs,
  onOpenMobileMenu,
}) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const { showToast } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      showToast('Logged out successfully', 'info');
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <header className="h-20 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-6 lg:px-8 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Left: Mobile Toggle + Breadcrumbs & Page Title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#64748B] hover:text-[#101828] hover:bg-slate-100 transition-colors -ml-1.5"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          {/* Breadcrumb line */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 hover:text-[#5145E5] transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#64748B]" />
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="font-medium text-[#64748B]">Dashboard</span>
            {breadcrumbs && breadcrumbs.length > 0 && breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="font-medium text-[#101828]">{b.label}</span>
              </React.Fragment>
            ))}
          </nav>

          {/* Page Title */}
          <h1 className="text-xl font-bold font-heading text-[#101828] tracking-tight leading-tight mt-0.5">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: User Profile Menu */}
      <div className="flex items-center gap-3" ref={dropdownRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-2xl text-[#101828] hover:bg-slate-50 transition-colors border border-transparent hover:border-[#E2E8F0]"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            {/* User Initial Circle */}
            <div className="w-9 h-9 rounded-full bg-[#5145E5] text-white font-bold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
              {user ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-[#101828] leading-tight">
                {user?.name || 'Amit Kumar'}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#059669] leading-tight mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#059669]" />
                <span>Active Session</span>
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-[#94A3B8] hidden sm:block ml-1" />
          </button>

          {/* User Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-[#101828] truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                  {user?.email}
                </p>
              </div>

              <div className="p-1.5 space-y-0.5">
                <Link
                  href="/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#475569] hover:text-[#5145E5] hover:bg-indigo-50/60 rounded-xl transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#64748B]" />
                  Dashboard
                </Link>

                <Link
                  href="/projects"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#475569] hover:text-[#5145E5] hover:bg-indigo-50/60 rounded-xl transition-colors"
                >
                  <FolderKanban className="w-4 h-4 text-[#64748B]" />
                  My Projects
                </Link>
              </div>

              <div className="p-1.5 border-t border-slate-100 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4 text-[#DC2626]" />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
