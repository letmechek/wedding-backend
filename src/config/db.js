import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error', error.message);
    process.exit(1);
  }
};
