import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  console.log('Database connected successfully');
};
