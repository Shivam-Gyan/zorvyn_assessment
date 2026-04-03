import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { formatResponse } from '../utils/apiResponse';

export const userController = {
  async listUsers(_req: Request, res: Response) {
    const users = await userService.listUsers();
    return res.status(200).json(formatResponse(true, 'Users fetched', users, null));
  },

  async updateUser(req: Request, res: Response) {
    const user = await userService.updateUser(req.params.userId, req.body);
    return res.status(200).json(formatResponse(true, 'User updated', user, null));
  },
};
