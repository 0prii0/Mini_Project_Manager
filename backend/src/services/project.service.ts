import prisma from '../config/database';
import {
  CreateProjectInput,
  UpdateProjectInput,
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from '../validators/project.validator';
import { HttpError } from '../utils/errors';

export interface ProjectWithCount {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    tasks: number;
  };
}

export class ProjectService {
  /**
   * Create a new project for the authenticated user
   */
  async createProject(userId: string, input: CreateProjectInput): Promise<ProjectWithCount> {
    const validated = createProjectSchema.parse(input);

    const project = await prisma.project.create({
      data: {
        userId,
        title: validated.title,
        description: validated.description ?? null,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return project;
  }

  /**
   * Retrieve all projects belonging to the authenticated user
   */
  async getProjects(userId: string): Promise<ProjectWithCount[]> {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return projects;
  }

  /**
   * Retrieve a single project by ID belonging to the authenticated user
   */
  async getProjectById(userId: string, projectId: string): Promise<ProjectWithCount> {
    projectIdParamSchema.parse({ id: projectId });

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!project) {
      throw new HttpError(404, 'Project not found');
    }

    return project;
  }

  /**
   * Update a project belonging to the authenticated user
   */
  async updateProject(
    userId: string,
    projectId: string,
    input: UpdateProjectInput
  ): Promise<ProjectWithCount> {
    projectIdParamSchema.parse({ id: projectId });
    const validated = updateProjectSchema.parse(input);

    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existing) {
      throw new HttpError(404, 'Project not found');
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(validated.title !== undefined && { title: validated.title }),
        ...(validated.description !== undefined && { description: validated.description }),
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return updated;
  }

  /**
   * Delete a project belonging to the authenticated user
   */
  async deleteProject(userId: string, projectId: string): Promise<void> {
    projectIdParamSchema.parse({ id: projectId });

    // Verify ownership
    const existing = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!existing) {
      throw new HttpError(404, 'Project not found');
    }

    // Cascade deletion handles tasks automatically according to schema
    await prisma.project.delete({
      where: { id: projectId },
    });
  }
}

export const projectService = new ProjectService();
