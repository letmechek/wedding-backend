import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    targetType: { type: String, enum: ['vendor', 'listing'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Review = mongoose.model('Review', reviewSchema);
