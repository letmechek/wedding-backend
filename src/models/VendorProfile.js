import mongoose from 'mongoose';

const vendorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    brandName: { type: String, required: true },
    primaryCategory: { type: String, default: '' },
    bio: { type: String, default: '' },
    categories: [{ type: String }],
    location: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    priceTier: { type: String, default: '$$' },
    verifiedPremium: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    payoutStatus: {
      type: String,
      enum: ['incomplete', 'complete'],
      default: 'incomplete'
    },
    legalName: { type: String, default: '' },
    businessEmail: { type: String, default: '' },
    phone: { type: String, default: '' },
    logo: { type: String, default: '' },
    agreedToTerms: { type: Boolean, default: false },
    heroImage: { type: String, default: '' },
    gallery: [{ type: String }],
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isSponsored: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const VendorProfile = mongoose.model('VendorProfile', vendorProfileSchema);
