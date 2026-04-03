import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { formatResponse } from '../utils/apiResponse';

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    return res.status(201).json(formatResponse(true, 'User registered successfully', result, null));
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return res.status(200).json(formatResponse(true, 'Login successful', result, null));
  },

  async profile(req: Request, res: Response) {
    const profile = await authService.getProfile(req.user!.sub);
    return res.status(200).json(formatResponse(true, 'Profile fetched', profile, null));
  },
};
