import { z } from 'zod';
import { mongoIdSchema, paginationQuerySchema } from './common.validators';

export const createTaskSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  project: mongoIdSchema,
  assignee: mongoIdSchema.optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignee: mongoIdSchema.optional(),
  dueDate: z.coerce.date().optional(),
});

export const taskIdParamSchema = z.object({
  taskId: mongoIdSchema,
});

export const taskListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  project: mongoIdSchema.optional(),
  assignee: mongoIdSchema.optional(),
});
