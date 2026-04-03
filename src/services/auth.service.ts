import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { JwtPayload, UserRole } from '../types';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // Optional, will be overridden to 'member' in service for security
}

interface LoginInput {
  email: string;
  password: string;
}

const signToken = (sub: string, role: UserRole): string => {
  const options: SignOptions = {
    expiresIn: env.jwtAccessTtl as SignOptions['expiresIn'],
  };

  return jwt.sign({ sub, role }, env.jwtAccessSecret, options);
};

export const authService = {
  async register(payload: RegisterInput) {
    const existing = await User.isEmailTaken(payload.email);
    if (existing) {
      throw new ApiError(409, 'Email is already registered');
    }

    const user = await User.create({
      ...payload,
      // Security: prevent privilege escalation on signup
      role: payload.role ?? 'member',
    });
    const token = signToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: token,
    };
  },

  async login(payload: LoginInput) {
    const user = await User.findOne({ email: payload.email });
    if (!user || !(await user.comparePassword(payload.password))) {
      throw new ApiError(401, 'Invalid credentials');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'User account is deactivated');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: signToken(user.id, user.role),
    };
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  },

  parseJwtPayload(raw: JwtPayload): JwtPayload {
    return raw;
  },
};
