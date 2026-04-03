import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload, UserRole } from '../types';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized: Bearer token missing');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    throw new ApiError(401, 'Unauthorized: Invalid or expired token');
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: user context not found');
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden: insufficient permissions');
    }
    next();
  };
};
