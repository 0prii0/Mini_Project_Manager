import { Router } from 'express';
import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

// Nested router mounted under /api/projects/:projectId/tasks
export const projectTaskRoutes = Router({ mergeParams: true });
projectTaskRoutes.use(authenticateToken);
projectTaskRoutes.post('/', createTask);
projectTaskRoutes.get('/', getProjectTasks);

// Top-level router mounted under /api/tasks
const taskRoutes = Router();
taskRoutes.use(authenticateToken);
taskRoutes.get('/:id', getTaskById);
taskRoutes.patch('/:id', updateTask);
taskRoutes.delete('/:id', deleteTask);

export default taskRoutes;
