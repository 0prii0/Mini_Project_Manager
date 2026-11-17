export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCounts {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export interface CreateTaskRequest {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string | null;
}

export interface UpdateTaskRequest {
  id: string;
  projectId: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
}

export interface GetTasksQueryArgs {
  projectId: string;
  status?: 'ALL' | TaskStatus;
  dateFilter?: 'ALL' | 'OVERDUE' | 'TODAY' | 'UPCOMING';
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: 'dueDate' | 'status' | 'createdAt' | 'title';
  order?: 'asc' | 'desc';
}

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
  counts: TaskCounts;
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  task: Task;
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}
