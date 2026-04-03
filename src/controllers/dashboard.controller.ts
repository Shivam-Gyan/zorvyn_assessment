import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { formatResponse } from '../utils/apiResponse';
import { dashboardQuerySchema } from '../validators/dashboard.validators';

export const dashboardController = {
  async summary(req: Request, res: Response) {
    const query = dashboardQuerySchema.parse(req.query);
    const data = await dashboardService.getSummary(req.user!.sub, req.user!.role, query);
    return res.status(200).json(formatResponse(true, 'Dashboard summary fetched', data, null));
  },

  async categories(req: Request, res: Response) {
    const query = dashboardQuerySchema.parse(req.query);
    const data = await dashboardService.getCategoryBreakdown(req.user!.sub, req.user!.role, query);
    return res.status(200).json(formatResponse(true, 'Dashboard categories fetched', data, null));
  },

  async trends(req: Request, res: Response) {
    const query = dashboardQuerySchema.parse(req.query);
    const data = await dashboardService.getTrends(req.user!.sub, req.user!.role, query);
    return res.status(200).json(formatResponse(true, 'Dashboard trends fetched', data, null));
  },

  async recent(req: Request, res: Response) {
    const query = dashboardQuerySchema.parse(req.query);
    const data = await dashboardService.getRecent(req.user!.sub, req.user!.role, query);
    return res.status(200).json(formatResponse(true, 'Dashboard recent transactions fetched', data, null));
  },
};
