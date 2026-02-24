import mongoose from 'mongoose';

const trendPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    image: { type: String, default: '' }
  },
  { timestamps: true }
);

export const TrendPost = mongoose.model('TrendPost', trendPostSchema);
