import { Request, Response } from 'express';
import { transactionService } from '../services/transaction.service';
import { formatResponse } from '../utils/apiResponse';
import { transactionListQuerySchema } from '../validators/transaction.validators';

export const transactionController = {
  async createTransaction(req: Request, res: Response) {
    const transaction = await transactionService.createTransaction(req.user!.sub, req.body);
    return res.status(201).json(formatResponse(true, 'Transaction created', transaction, null));
  },

  async updateTransaction(req: Request, res: Response) {
    const transaction = await transactionService.updateTransaction(
      req.params.transactionId,
      req.user!.sub,
      req.user!.role,
      req.body,
    );
    return res.status(200).json(formatResponse(true, 'Transaction updated', transaction, null));
  },

  async getTransaction(req: Request, res: Response) {
    const transaction = await transactionService.getTransaction(req.params.transactionId, req.user!.sub, req.user!.role);
    return res.status(200).json(formatResponse(true, 'Transaction fetched', transaction, null));
  },

  async listTransactions(req: Request, res: Response) {
    const query = transactionListQuerySchema.parse(req.query);
    const result = await transactionService.listTransactions(
      req.user!.sub,
      req.user!.role,
      query,
    );
    return res.status(200).json(formatResponse(true, 'Transactions fetched', result, null));
  },

  async deleteTransaction(req: Request, res: Response) {
    await transactionService.deleteTransaction(req.params.transactionId, req.user!.sub, req.user!.role);
    return res.status(200).json(formatResponse(true, 'Transaction deleted', null, null));
  },
};
