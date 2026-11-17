import { Metadata } from 'next';
import { ProjectDetailsContent } from './ProjectDetailsContent';
import { AppLayout } from '@/components/layout/AppLayout';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Project Details | Mini Project Manager`,
    description: `Workspace details for project ${id}`,
  };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <AppLayout title="Project Details">
      <ProjectDetailsContent projectId={id} />
    </AppLayout>
  );
}
