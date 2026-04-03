import { dashboardService } from '../src/services/dashboard.service';
import { Transaction } from '../src/models/Transaction';

describe('dashboardService.getSummary', () => {
  it('returns computed summary from aggregation pipeline result', async () => {
    const spy = jest.spyOn(Transaction, 'aggregate').mockResolvedValueOnce([
      { totalIncome: 5000, totalExpenses: 1800, netBalance: 3200 },
    ] as any);

    const result = await dashboardService.getSummary('507f191e810c19729de860ea', 'admin', {
      limit: 5,
      interval: 'month',
    });

    expect(result).toEqual({ totalIncome: 5000, totalExpenses: 1800, netBalance: 3200 });
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
