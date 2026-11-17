import { Metadata } from 'next';
import { ProjectsContent } from './ProjectsContent';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'My Projects | Mini Project Manager',
  description: 'Manage all your projects and workspace tasks',
};

export default function ProjectsPage() {
  return (
    <AppLayout title="My Projects">
      <ProjectsContent />
    </AppLayout>
  );
}
