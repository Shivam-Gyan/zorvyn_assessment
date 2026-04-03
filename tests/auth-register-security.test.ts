process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-secret';

import { authService } from '../src/services/auth.service';
import { User } from '../src/models/User';

describe('authService.register security', () => {
  it('forces role to member even if client attempts admin role', async () => {
    jest.spyOn(User, 'isEmailTaken').mockResolvedValueOnce(false);

    const createSpy = jest.spyOn(User, 'create').mockResolvedValueOnce({
      id: 'user-id-1',
      name: 'Secure User',
      email: 'secure@example.com',
      role: 'member',
    } as any);

    await authService.register({
      name: 'Secure User',
      email: 'secure@example.com',
      password: 'Password123!',
      role: 'admin',
    } as any);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'member',
      }),
    );
  });
});
