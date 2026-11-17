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
  createdAt: string;
  updatedAt: string;
  taskCount: number;
}

export interface DashboardRecentTask {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentProjects: DashboardRecentProject[];
  recentTasks: DashboardRecentTask[];
}
