import { z } from 'zod';
import { mongoIdSchema } from './common.validators';

export const createProjectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  members: z.array(mongoIdSchema).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  members: z.array(mongoIdSchema).optional(),
});

export const projectIdParamSchema = z.object({
  projectId: mongoIdSchema,
});
