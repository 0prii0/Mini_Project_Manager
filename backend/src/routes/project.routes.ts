import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { projectTaskRoutes } from './task.routes';

const router = Router();

// All project endpoints require valid JWT authentication
router.use(authenticateToken);

// Project Task endpoints: /api/projects/:projectId/tasks
router.use('/:projectId/tasks', projectTaskRoutes);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
