import { Booking } from '../models/Booking.js';
import { ServiceListing } from '../models/ServiceListing.js';
import { User } from '../models/User.js';
import { VendorProfile } from '../models/VendorProfile.js';

const getVendorByUserId = async (userId) => VendorProfile.findOne({ userId });

const ensureVendor = async (req, res) => {
  const vendor = await getVendorByUserId(req.user._id);
  if (!vendor) {
    res.status(404).json({ message: 'Vendor profile not found' });
    return null;
  }
  return vendor;
};

const normalizeListingPayload = (payload = {}) => {
  const next = { ...payload };
  if (next.status === 'active') next.isActive = true;
  if (next.status === 'draft' || next.status === 'paused') next.isActive = false;
  if (typeof next.isActive === 'boolean' && !next.status) {
    next.status = next.isActive ? 'active' : 'paused';
  }
  return next;
};

export const vendorOnboarding = async (req, res) => {
  const {
    brandName,
    primaryCategory,
    categories = [],
    city = '',
    state = '',
    location = '',
    priceTier = '$$',
    bio = '',
    heroImage = '',
    gallery = [],
    logo = '',
    legalName = '',
    businessEmail = '',
    phone = '',
    agreedToTerms = false
  } = req.body;

  if (!brandName || !primaryCategory) {
    return res.status(400).json({ message: 'Brand name and primary category are required' });
  }

  const mergedLocation = location || [city, state].filter(Boolean).join(', ');

  const vendor = await VendorProfile.findOneAndUpdate(
    { userId: req.user._id },
    {
      userId: req.user._id,
      brandName,
      primaryCategory,
      categories: [primaryCategory, ...categories.filter((c) => c !== primaryCategory)],
      city,
      state,
      location: mergedLocation,
      priceTier,
      bio: bio.slice(0, 300),
      heroImage,
      gallery,
      logo,
      legalName,
      businessEmail,
      phone,
      agreedToTerms: Boolean(agreedToTerms),
      verificationStatus: 'pending',
      payoutStatus: agreedToTerms ? 'complete' : 'incomplete'
    },
    { new: true, upsert: true }
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { role: 'vendor' },
    { new: true }
  ).select('_id role name email avatarUrl createdAt');

  res.json({ vendor, user });
};

export const getVendorMe = async (req, res) => {
  const vendor = await VendorProfile.findOne({ userId: req.user._id });
  if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
  res.json({ vendor });
};

export const updateVendorMe = async (req, res) => {
  const payload = { ...req.body };
  delete payload.verifiedPremium;
  delete payload.verificationStatus;
  delete payload.userId;

  if (payload.bio) payload.bio = payload.bio.slice(0, 300);

  const vendor = await VendorProfile.findOneAndUpdate(
    { userId: req.user._id },
    payload,
    { new: true, upsert: true }
  );
  res.json({ vendor });
};

export const createVendorListing = async (req, res) => {
  const vendor = await ensureVendor(req, res);
  if (!vendor) return;

  const payload = normalizeListingPayload(req.body);
  const listing = await ServiceListing.create({ ...payload, vendorId: vendor._id });
  res.status(201).json({ listing });
};

export const getVendorListingById = async (req, res) => {
  const vendor = await ensureVendor(req, res);
  if (!vendor) return;

  const listing = await ServiceListing.findOne({ _id: req.params.id, vendorId: vendor._id });
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json({ listing });
};

export const updateVendorListing = async (req, res) => {
  const vendor = await ensureVendor(req, res);
  if (!vendor) return;

  const payload = normalizeListingPayload(req.body);
  const listing = await ServiceListing.findOneAndUpdate(
    { _id: req.params.id, vendorId: vendor._id },
    payload,
    { new: true }
  );

  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json({ listing });
};

export const deleteVendorListing = async (req, res) => {
  const vendor = await ensureVendor(req, res);
  if (!vendor) return;

  const listing = await ServiceListing.findOneAndUpdate(
    { _id: req.params.id, vendorId: vendor._id },
    { isActive: false, status: 'paused' },
    { new: true }
  );

  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json({ listing });
};

export const getVendorListings = async (req, res) => {
  const vendor = await ensureVendor(req, res);
  if (!vendor) return;

  const listings = await ServiceListing.find({ vendorId: vendor._id }).sort({ createdAt: -1 });
  res.json({ listings });
};

export const getVendorBookings = async (req, res) => {
  const vendor = await ensureVendor(req, res);
  if (!vendor) return;

  const { status } = req.query;
  const query = { vendorId: vendor._id };
  if (status) query.bookingStatus = status;

  const bookings = await Booking.find(query)
    .populate('clientId', 'name email')
    .populate('listingId', 'title images')
    .sort({ createdAt: -1 });

  res.json({ bookings });
};

export const updateVendorBookingStatus = async (req, res) => {
  const vendor = await ensureVendor(req, res);
  if (!vendor) return;

  const { status } = req.body;
  const allowed = ['confirmed', 'cancelled', 'completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, vendorId: vendor._id },
    { bookingStatus: status },
    { new: true }
  )
    .populate('clientId', 'name email')
    .populate('listingId', 'title images');

  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json({ booking });
};
