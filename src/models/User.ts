import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['admin', 'manager', 'member'], default: 'member' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.isEmailTaken = async function isEmailTaken(email: string, excludeUserId?: string) {
  const user = await this.findOne({
    email,
    ...(excludeUserId ? { _id: { $ne: excludeUserId } } : {}),
  });
  return Boolean(user);
};

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
