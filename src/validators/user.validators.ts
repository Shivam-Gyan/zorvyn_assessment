import { z } from 'zod';
import { mongoIdSchema } from './common.validators';

export const userIdParamSchema = z.object({
  userId: mongoIdSchema,
});

export const updateUserSchema = z.object({
  role: z.enum(['admin', 'manager', 'member']).optional(),
  isActive: z.boolean().optional(),
});
