'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileSidebar } from './MobileSidebar';
import { BreadcrumbItem } from './Breadcrumbs';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  breadcrumbs,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F3F6FF] flex flex-row text-[#101828]">
        {/* Desktop Sidebar (fixed 280px on lg+) */}
        <div className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 fixed inset-y-0 z-40">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-[280px] flex flex-col min-w-0 min-h-screen">
          <Header
            title={title}
            breadcrumbs={breadcrumbs}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
