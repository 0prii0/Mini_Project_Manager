import prisma from '../config/database';

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  completionRate: number;
}

export interface DashboardRecentProject {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  taskCount: number;
}

export interface DashboardRecentTask {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardData {
  stats: DashboardStats;
  recentProjects: DashboardRecentProject[];
  recentTasks: DashboardRecentTask[];
}

export class DashboardService {
  /**
   * Aggregate statistics, recent projects, and recent tasks
   * strictly for the authenticated user.
   */
  async getDashboardData(userId: string): Promise<DashboardData> {
    const [totalProjects, taskCounts, rawRecentProjects, rawRecentTasks] =
      await Promise.all([
        // 1. Total projects count
        prisma.project.count({
          where: { userId },
        }),

        // 2. Status distribution for all tasks belonging to user's projects
        prisma.task.groupBy({
          by: ['status'],
          where: {
            project: {
              userId,
            },
          },
          _count: {
            id: true,
          },
        }),

        // 3. Up to 5 most recently updated projects
        prisma.project.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          include: {
            _count: {
              select: { tasks: true },
            },
          },
        }),

        // 4. Up to 5 most recently updated tasks with project title
        prisma.task.findMany({
          where: {
            project: {
              userId,
            },
          },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          include: {
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        }),
      ]);

    // Parse status counts
    let todoTasks = 0;
    let inProgressTasks = 0;
    let doneTasks = 0;

    for (const group of taskCounts) {
      if (group.status === 'TODO') todoTasks = group._count.id;
      else if (group.status === 'IN_PROGRESS') inProgressTasks = group._count.id;
      else if (group.status === 'DONE') doneTasks = group._count.id;
    }

    const totalTasks = todoTasks + inProgressTasks + doneTasks;
    const completionRate =
      totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const stats: DashboardStats = {
      totalProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      doneTasks,
      completionRate,
    };

    const recentProjects: DashboardRecentProject[] = rawRecentProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      taskCount: p._count.tasks,
    }));

    const recentTasks: DashboardRecentTask[] = rawRecentTasks.map((t) => ({
      id: t.id,
      projectId: t.projectId,
      projectTitle: t.project.title,
      title: t.title,
      description: t.description,
      status: t.status as 'TODO' | 'IN_PROGRESS' | 'DONE',
      dueDate: t.dueDate,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return {
      stats,
      recentProjects,
      recentTasks,
    };
  }
}

export const dashboardService = new DashboardService();
