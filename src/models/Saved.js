import mongoose from 'mongoose';

const savedSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['vendor', 'listing'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

savedSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Saved = mongoose.model('Saved', savedSchema);
