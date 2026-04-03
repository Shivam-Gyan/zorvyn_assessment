export const API_PREFIX = '/api/v1';

export const ROLES = {
  ADMIN: 'admin',
  ANALYST: 'manager',
  VIEWER: 'member',
} as const;

export const TRANSACTION_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;
