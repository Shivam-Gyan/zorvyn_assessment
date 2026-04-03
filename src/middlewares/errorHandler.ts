import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { formatResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(formatResponse(false, `Route not found: ${req.originalUrl}`, null, null));
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(formatResponse(false, error.message, null, error.details ?? null));
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json(formatResponse(false, 'Validation failed', null, error.flatten()));
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json(formatResponse(false, 'Invalid resource identifier', null, { path: error.path }));
    return;
  }

  if ((error as any).code === 11000) {
    res.status(409).json(formatResponse(false, 'Duplicate data conflict', null, (error as any).keyValue));
    return;
  }

  res.status(500).json(formatResponse(false, 'Internal server error', null, { message: error.message }));
};
