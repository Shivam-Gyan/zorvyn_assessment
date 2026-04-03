import { z } from 'zod';

export const dashboardQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(5),
  interval: z.enum(['week', 'month']).default('month'),
});

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
