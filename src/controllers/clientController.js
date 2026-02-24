import { Booking } from '../models/Booking.js';
import { Saved } from '../models/Saved.js';
import { ServiceListing } from '../models/ServiceListing.js';
import { verifySucceededPaymentIntent } from './paymentController.js';
import { generateConfirmationCode } from '../utils/generateConfirmationCode.js';

export const createBooking = async (req, res) => {
  const { listingId, packageId, eventDate, hours, totalAmount, paymentId } = req.body;
  if (!listingId || !packageId || !eventDate || !hours || !totalAmount || !paymentId) {
    return res.status(400).json({ message: 'Missing booking fields' });
  }

  const existingPaymentBooking = await Booking.findOne({ paymentId });
  if (existingPaymentBooking) {
    return res.status(409).json({ message: 'This payment was already used for a booking' });
  }

  const listing = await ServiceListing.findById(listingId);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  const selectedPackage = listing.packages.id(packageId);
  if (!selectedPackage) return res.status(404).json({ message: 'Package not found' });

  await verifySucceededPaymentIntent({
    paymentId,
    expectedTotalAmount: totalAmount,
    clientId: req.user._id
  });

  const booking = await Booking.create({
    clientId: req.user._id,
    vendorId: listing.vendorId,
    listingId: listing._id,
    packageId: selectedPackage._id,
    eventDate,
    hours: Number(hours),
    totalAmount: Number(totalAmount),
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    confirmationCode: generateConfirmationCode(),
    paymentId
  });

  const populated = await Booking.findById(booking._id)
    .populate('listingId')
    .populate('vendorId')
    .populate('clientId', 'name email');

  res.status(201).json({ booking: populated });
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ clientId: req.user._id })
    .populate('listingId')
    .populate('vendorId')
    .sort({ createdAt: -1 });

  res.json({ bookings });
};

export const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('listingId')
    .populate('vendorId')
    .populate('clientId', 'name email');

  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const isOwner = booking.clientId._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'vendor') return res.status(403).json({ message: 'Forbidden' });

  res.json({ booking });
};

export const addSavedItem = async (req, res) => {
  const { targetType, targetId } = req.body;
  if (!targetType || !targetId) {
    return res.status(400).json({ message: 'targetType and targetId required' });
  }

  const saved = await Saved.findOneAndUpdate(
    { userId: req.user._id, targetType, targetId },
    { userId: req.user._id, targetType, targetId },
    { upsert: true, new: true }
  );

  res.status(201).json({ saved });
};

export const getSavedItems = async (req, res) => {
  const savedItems = await Saved.find({ userId: req.user._id }).sort({ createdAt: -1 });

  const hydrated = await Promise.all(
    savedItems.map(async (item) => {
      if (item.targetType === 'listing') {
        const listing = await ServiceListing.findById(item.targetId).populate('vendorId');
        return { ...item.toObject(), listing };
      }
      return item;
    })
  );

  res.json({ savedItems: hydrated });
};
