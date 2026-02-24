import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String, default: '' },
    price: { type: Number, required: true },
    hours: { type: Number, default: 1 },
    inclusions: [{ type: String }]
  },
  { _id: true }
);

const addOnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const serviceListingSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    packages: [packageSchema],
    addOns: [addOnSchema],
    basePrice: { type: Number, required: true },
    durationHours: { type: Number, default: 1 },
    location: { type: String, default: '' },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'active', 'paused'],
      default: 'draft'
    },
    isSponsored: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ServiceListing = mongoose.model('ServiceListing', serviceListingSchema);
