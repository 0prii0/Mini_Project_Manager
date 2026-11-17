import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Health check route: /api/health
router.use('/health', healthRoutes);

// Authentication routes: /api/auth
router.use('/auth', authRoutes);

// Dashboard routes: /api/dashboard
router.use('/dashboard', dashboardRoutes);

// Project management routes: /api/projects
router.use('/projects', projectRoutes);

// Task management routes: /api/tasks
router.use('/tasks', taskRoutes);

export default router;
