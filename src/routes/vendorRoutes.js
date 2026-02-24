import { Router } from 'express';
import {
  deleteVendorListing,
  createVendorListing,
  getVendorBookings,
  getVendorListingById,
  getVendorListings,
  getVendorMe,
  updateVendorBookingStatus,
  updateVendorListing,
  updateVendorMe,
  vendorOnboarding
} from '../controllers/vendorController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = Router();

router.post('/onboarding', requireAuth, vendorOnboarding);
router.get('/me', requireAuth, requireRole('vendor'), getVendorMe);
router.put('/me', requireAuth, requireRole('vendor'), updateVendorMe);
router.post('/listings', requireAuth, requireRole('vendor'), createVendorListing);
router.get('/listings', requireAuth, requireRole('vendor'), getVendorListings);
router.get('/listings/:id', requireAuth, requireRole('vendor'), getVendorListingById);
router.put('/listings/:id', requireAuth, requireRole('vendor'), updateVendorListing);
router.delete('/listings/:id', requireAuth, requireRole('vendor'), deleteVendorListing);
router.get('/bookings', requireAuth, requireRole('vendor'), getVendorBookings);
router.put('/bookings/:id/status', requireAuth, requireRole('vendor'), updateVendorBookingStatus);

export default router;
