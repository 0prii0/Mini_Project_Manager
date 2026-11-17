import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '../store/provider';
import { Navbar } from '../components/layout/Navbar';
import { AuthInitializer } from '../components/auth/AuthInitializer';
import { ToastProvider } from '../components/common/Toast';

export const metadata: Metadata = {
  title: 'Mini Project Manager | Enterprise Task & Project Platform',
  description: 'Scalable Full Stack Mini Project Management Application built with Next.js, Express, PostgreSQL, and Prisma.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-[#F3F6FF] text-[#101828]">
        <ReduxProvider>
          <AuthInitializer>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
            </ToastProvider>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
