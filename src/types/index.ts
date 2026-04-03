export type UserRole = 'admin' | 'manager' | 'member';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  error: unknown;
}
