import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['client', 'vendor'],
      default: 'client'
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    refreshToken: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = mongoose.model('User', userSchema);
