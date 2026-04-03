import { FilterQuery } from 'mongoose';
import { ITransaction, Transaction } from '../models/Transaction';
import { ApiError } from '../utils/ApiError';

interface CreateTransactionInput {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  notes?: string;
}

interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

interface ListTransactionQuery {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  type?: 'income' | 'expense';
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

const buildVisibilityFilter = (userId: string, role: string): FilterQuery<ITransaction> => {
  if (role === 'admin') {
    return {};
  }

  return { createdBy: userId };
};

export const transactionService = {
  async createTransaction(userId: string, payload: CreateTransactionInput) {
    return Transaction.create({
      ...payload,
      createdBy: userId,
    });
  },

  async updateTransaction(transactionId: string, userId: string, role: string, payload: UpdateTransactionInput) {
    const visibilityFilter = buildVisibilityFilter(userId, role);
    const transaction = await Transaction.findOne({ _id: transactionId, ...visibilityFilter });

    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    Object.assign(transaction, payload);
    await transaction.save();

    return transaction;
  },

  async getTransaction(transactionId: string, userId: string, role: string) {
    const visibilityFilter = buildVisibilityFilter(userId, role);
    const transaction = await Transaction.findOne({ _id: transactionId, ...visibilityFilter }).populate(
      'createdBy',
      'name email role',
    );

    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    return transaction;
  },

  async listTransactions(userId: string, role: string, query: ListTransactionQuery) {
    const filter: FilterQuery<ITransaction> = {
      ...buildVisibilityFilter(userId, role),
    };

    if (query.type) filter.type = query.type;
    if (query.category) filter.category = query.category;
    if (query.startDate || query.endDate) {
      filter.date = {
        ...(query.startDate ? { $gte: query.startDate } : {}),
        ...(query.endDate ? { $lte: query.endDate } : {}),
      };
    }

    const skip = (query.page - 1) * query.limit;
    const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ [query.sortBy]: sortDirection })
        .skip(skip)
        .limit(query.limit),
      Transaction.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async deleteTransaction(transactionId: string, userId: string, role: string) {
    const visibilityFilter = buildVisibilityFilter(userId, role);
    const transaction = await Transaction.findOne({ _id: transactionId, ...visibilityFilter });

    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    await transaction.deleteOne();
  },
};
