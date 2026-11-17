import { Metadata } from 'next';
import { DashboardContent } from './DashboardContent';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'Dashboard | Mini Project Manager',
  description: 'Manage your projects, workspaces, and team deliverables',
};

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <DashboardContent />
    </AppLayout>
  );
}
