import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceListing', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, required: true },
    eventDate: { type: Date, required: true },
    hours: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid'
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    confirmationCode: { type: String, required: true },
    paymentId: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Booking = mongoose.model('Booking', bookingSchema);
