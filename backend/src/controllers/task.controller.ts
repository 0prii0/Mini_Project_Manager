import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';

/**
 * POST /api/projects/:projectId/tasks
 * Create a new task under the specified project
 */
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await taskService.createTask(
      req.user!.id,
      req.params.projectId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:projectId/tasks
 * Get all tasks of a project with filtering & sorting
 */
export const getProjectTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await taskService.getTasksByProject(
      req.user!.id,
      req.params.projectId,
      req.query as any
    );
    res.status(200).json({
      success: true,
      tasks: result.tasks,
      counts: result.counts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * Get single task by ID
 */
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await taskService.getTaskById(req.user!.id, req.params.id);
    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id
 * Update task details (status, title, description, dueDate)
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await taskService.updateTask(
      req.user!.id,
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete task by ID
 */
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await taskService.deleteTask(req.user!.id, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
