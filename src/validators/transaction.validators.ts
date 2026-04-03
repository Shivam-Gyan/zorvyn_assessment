import { z } from 'zod';
import { mongoIdSchema, paginationQuerySchema } from './common.validators';

export const createTransactionSchema = z.object({
  amount: z.number().nonnegative(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(2).max(80),
  date: z.coerce.date(),
  notes: z.string().max(500).optional(),
});

export const updateTransactionSchema = z.object({
  amount: z.number().nonnegative().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(2).max(80).optional(),
  date: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

export const transactionIdParamSchema = z.object({
  transactionId: mongoIdSchema,
});

export const transactionListQuerySchema = paginationQuerySchema.extend({
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(2).max(80).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type TransactionListQuery = z.infer<typeof transactionListQuerySchema>;
