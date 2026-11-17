import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Mini Project Manager API is running',
    timestamp: new Date().toISOString(),
  });
};
