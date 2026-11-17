'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customItems }) => {
  const pathname = usePathname();

  let items: BreadcrumbItem[] = [];

  if (customItems && customItems.length > 0) {
    items = customItems;
  } else {
    // Generate dynamically from pathname
    const segments = pathname.split('/').filter(Boolean);
    items = segments.map((seg, idx) => {
      const url = `/${segments.slice(0, idx + 1).join('/')}`;
      let label = seg.charAt(0).toUpperCase() + seg.slice(1);
      if (seg === 'dashboard') label = 'Dashboard';
      else if (seg === 'projects') label = 'Projects';
      else if (seg.length > 12) label = 'Details';

      return {
        label,
        href: idx === segments.length - 1 ? undefined : url,
      };
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-[#64748B]">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 hover:text-[#4F46E5] transition-colors"
        title="Dashboard Home"
      >
        <Home className="w-3.5 h-3.5 text-[#94A3B8]" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-[#0F172A] truncate max-w-[160px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[#4F46E5] transition-colors truncate max-w-[120px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
