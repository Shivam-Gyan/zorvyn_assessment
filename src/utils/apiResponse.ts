import { ApiResponse } from '../types';

export const formatResponse = <T>(
  success: boolean,
  message: string,
  data: T | null = null,
  error: unknown = null,
): ApiResponse<T> => ({
  success,
  message,
  data,
  error,
});
