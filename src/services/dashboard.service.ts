import { FilterQuery } from 'mongoose';
import { ITransaction, Transaction } from '../models/Transaction';

interface DashboardQuery {
  startDate?: Date;
  endDate?: Date;
  limit: number;
  interval: 'week' | 'month';
}

const buildMatch = (userId: string, role: string, query: DashboardQuery): FilterQuery<ITransaction> => {
  const match: FilterQuery<ITransaction> = {};

  if (role !== 'admin') {
    match.createdBy = userId;
  }

  if (query.startDate || query.endDate) {
    match.date = {
      ...(query.startDate ? { $gte: query.startDate } : {}),
      ...(query.endDate ? { $lte: query.endDate } : {}),
    };
  }

  return match;
};

export const dashboardService = {
  async getSummary(userId: string, role: string, query: DashboardQuery) {
    const match = buildMatch(userId, role, query);
    const [result] = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpenses: 1,
          netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] },
        },
      },
    ]);

    return result || { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
  },

  async getCategoryBreakdown(userId: string, role: string, query: DashboardQuery) {
    const match = buildMatch(userId, role, query);

    return Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          amount: 1,
          count: 1,
        },
      },
      { $sort: { amount: -1 } },
    ]);
  },

  async getTrends(userId: string, role: string, query: DashboardQuery) {
    const match = buildMatch(userId, role, query);

    const groupId =
      query.interval === 'week'
        ? { year: { $isoWeekYear: '$date' }, week: { $isoWeek: '$date' } }
        : { year: { $year: '$date' }, month: { $month: '$date' } };

    return Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: groupId,
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          period: '$_id',
          income: 1,
          expense: 1,
          net: { $subtract: ['$income', '$expense'] },
        },
      },
      { $sort: { 'period.year': 1, 'period.week': 1, 'period.month': 1 } },
    ]);
  },

  async getRecent(userId: string, role: string, query: DashboardQuery) {
    const match = buildMatch(userId, role, query);

    return Transaction.find(match)
      .sort({ date: -1 })
      .limit(query.limit)
      .select('amount type category date notes createdBy');
  },
};
