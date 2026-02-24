import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { Review } from '../models/Review.js';
import { ServiceListing } from '../models/ServiceListing.js';
import { TrendPost } from '../models/TrendPost.js';
import { VendorProfile } from '../models/VendorProfile.js';

export const getCategories = async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories });
};

export const getListings = async (req, res) => {
  const {
    search = '',
    category,
    isSponsored,
    page = 1,
    limit = 12,
    minPrice,
    maxPrice,
    vendorId
  } = req.query;

  const query = { isActive: true };

  if (category) query.category = category;
  if (typeof isSponsored !== 'undefined') query.isSponsored = isSponsored === 'true';
  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice) query.basePrice.$gte = Number(minPrice);
    if (maxPrice) query.basePrice.$lte = Number(maxPrice);
  }
  if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
    query.vendorId = vendorId;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [listings, total] = await Promise.all([
    ServiceListing.find(query)
      .populate('vendorId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ServiceListing.countDocuments(query)
  ]);

  res.json({ listings, pagination: { page: Number(page), limit: Number(limit), total } });
};

export const getListingById = async (req, res) => {
  const listing = await ServiceListing.findById(req.params.id).populate('vendorId');
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json({ listing });
};

export const getVendorById = async (req, res) => {
  const vendor = await VendorProfile.findById(req.params.id).populate('userId', 'name email avatarUrl');
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

  const listings = await ServiceListing.find({ vendorId: vendor._id, isActive: true }).limit(12);
  res.json({ vendor, listings });
};

export const getReviews = async (req, res) => {
  const { targetType, targetId } = req.query;
  if (!targetType || !targetId) {
    return res.status(400).json({ message: 'targetType and targetId are required' });
  }

  const reviews = await Review.find({ targetType, targetId })
    .populate('userId', 'name avatarUrl')
    .sort({ createdAt: -1 });

  res.json({ reviews });
};

export const getTrends = async (_req, res) => {
  const trends = await TrendPost.find().sort({ createdAt: -1 }).limit(10);
  res.json({ trends });
};
