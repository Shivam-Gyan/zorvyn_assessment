import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';

export const userService = {
  async listUsers() {
    return User.find().select('-password').sort({ createdAt: -1 });
  },

  async updateUser(userId: string, payload: { role?: 'admin' | 'manager' | 'member'; isActive?: boolean }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (payload.role) user.role = payload.role;
    if (typeof payload.isActive === 'boolean') user.isActive = payload.isActive;

    await user.save();
    return User.findById(userId).select('-password');
  },
};
