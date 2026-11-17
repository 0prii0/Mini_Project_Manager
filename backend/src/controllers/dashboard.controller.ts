import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';

/**
 * GET /api/dashboard
 * Retrieve aggregated statistics, recent projects, and recent tasks
 * for the authenticated user only.
 */
export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await dashboardService.getDashboardData(req.user!.id);
    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};
