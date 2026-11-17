import prisma from '../config/database';
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryInput,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdParamSchema,
  projectTaskIdParamSchema,
} from '../validators/task.validator';
import { HttpError } from '../utils/errors';
import { Task, TaskStatus } from '@prisma/client';

export interface TaskCounts {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export interface ProjectTasksResult {
  tasks: Task[];
  counts: TaskCounts;
}

export class TaskService {
  /**
   * Create a new task under a specific project (verifying project ownership)
   */
  async createTask(
    userId: string,
    projectId: string,
    input: CreateTaskInput
  ): Promise<Task> {
    projectTaskIdParamSchema.parse({ projectId });
    const validated = createTaskSchema.parse(input);

    // Verify project belongs to authenticated user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new HttpError(404, 'Project not found or unauthorized');
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title: validated.title,
        description: validated.description ?? null,
        status: (validated.status as TaskStatus) ?? TaskStatus.TODO,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      },
    });

    return task;
  }

  /**
   * Retrieve all tasks for a project with combined status/date filtering and sorting
   */
  async getTasksByProject(
    userId: string,
    projectId: string,
    rawQuery: TaskQueryInput
  ): Promise<ProjectTasksResult> {
    projectTaskIdParamSchema.parse({ projectId });
    const query = taskQuerySchema.parse(rawQuery);

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new HttpError(404, 'Project not found or unauthorized');
    }

    // Compute status counts for the entire project (independent of current filters)
    const allProjectTasks = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: {
        status: true,
      },
    });

    const counts: TaskCounts = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    allProjectTasks.forEach((group) => {
      const count = group._count.status;
      counts.total += count;
      if (group.status === TaskStatus.TODO) counts.todo = count;
      else if (group.status === TaskStatus.IN_PROGRESS) counts.inProgress = count;
      else if (group.status === TaskStatus.DONE) counts.done = count;
    });

    // Build Prisma filtering conditions
    const whereClause: any = {
      projectId,
    };

    // Status filter
    if (query.status && query.status !== 'ALL') {
      whereClause.status = query.status;
    }

    // Date calculations (Current calendar day boundaries in local/server time)
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (query.dateFilter === 'OVERDUE') {
      whereClause.dueDate = {
        lt: startOfToday,
        not: null,
      };
      // Overdue applies to tasks that are not DONE unless user explicitly filtered by a status
      if (!query.status || query.status === 'ALL') {
        whereClause.status = {
          not: TaskStatus.DONE,
        };
      }
    } else if (query.dateFilter === 'TODAY') {
      whereClause.dueDate = {
        gte: startOfToday,
        lte: endOfToday,
      };
    } else if (query.dateFilter === 'UPCOMING') {
      whereClause.dueDate = {
        gt: endOfToday,
      };
    }

    // Custom date range filtering (dueDateFrom & dueDateTo)
    if (query.dueDateFrom || query.dueDateTo) {
      whereClause.dueDate = {
        ...(whereClause.dueDate || {}),
        not: null,
      };

      if (query.dueDateFrom) {
        const fromDate = new Date(query.dueDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        whereClause.dueDate.gte = fromDate;
      }

      if (query.dueDateTo) {
        const toDate = new Date(query.dueDateTo);
        toDate.setHours(23, 59, 59, 999);
        whereClause.dueDate.lte = toDate;
      }
    }

    // Sorting configuration
    let orderBy: any;
    if (query.sortBy === 'dueDate') {
      // For due date sorting, tasks with null due dates consistently appear last
      orderBy = [
        {
          dueDate: {
            sort: query.order,
            nulls: 'last',
          },
        },
        { createdAt: 'desc' },
      ];
    } else if (query.sortBy === 'status') {
      // PostgreSQL enum ordering naturally preserves TODO (1) -> IN_PROGRESS (2) -> DONE (3)
      orderBy = [
        { status: query.order },
        { createdAt: 'desc' },
      ];
    } else if (query.sortBy === 'title') {
      orderBy = [
        { title: query.order },
        { createdAt: 'desc' },
      ];
    } else {
      // Default: createdAt
      orderBy = [{ createdAt: query.order }];
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy,
    });

    return {
      tasks,
      counts,
    };
  }

  /**
   * Retrieve a single task by ID (verifying ownership through associated project)
   */
  async getTaskById(userId: string, taskId: string): Promise<Task> {
    taskIdParamSchema.parse({ id: taskId });

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId,
        },
      },
    });

    if (!task) {
      throw new HttpError(404, 'Task not found or unauthorized');
    }

    return task;
  }

  /**
   * Update task details (partial updates allowed, verifies ownership)
   */
  async updateTask(
    userId: string,
    taskId: string,
    input: UpdateTaskInput
  ): Promise<Task> {
    taskIdParamSchema.parse({ id: taskId });
    const validated = updateTaskSchema.parse(input);

    // Verify ownership through project
    const existing = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId,
        },
      },
    });

    if (!existing) {
      throw new HttpError(404, 'Task not found or unauthorized');
    }

    const updateData: any = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.status !== undefined) updateData.status = validated.status as TaskStatus;
    if (validated.dueDate !== undefined) {
      updateData.dueDate = validated.dueDate ? new Date(validated.dueDate) : null;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return updatedTask;
  }

  /**
   * Delete a task (verifies ownership)
   */
  async deleteTask(userId: string, taskId: string): Promise<void> {
    taskIdParamSchema.parse({ id: taskId });

    // Verify ownership through project
    const existing = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId,
        },
      },
    });

    if (!existing) {
      throw new HttpError(404, 'Task not found or unauthorized');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}

export const taskService = new TaskService();
