import { Request, Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';

/**
 * POST /api/projects
 * Create a new project for the authenticated user
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.createProject(req.user!.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects
 * Get all projects belonging to the authenticated user
 */
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await projectService.getProjects(req.user!.id);
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:id
 * Get a single project by ID belonging to the authenticated user
 */
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.user!.id, req.params.id);
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/projects/:id
 * Update a project belonging to the authenticated user
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const project = await projectService.updateProject(
      req.user!.id,
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id
 * Delete a project belonging to the authenticated user
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await projectService.deleteProject(req.user!.id, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
