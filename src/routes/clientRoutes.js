import { Router } from 'express';
import {
  addSavedItem,
  createBooking,
  getBookingById,
  getMyBookings,
  getSavedItems
} from '../controllers/clientController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = Router();

router.post('/bookings', requireAuth, requireRole('client'), createBooking);
router.get('/bookings/me', requireAuth, requireRole('client'), getMyBookings);
router.get('/bookings/:id', requireAuth, getBookingById);
router.post('/saved', requireAuth, addSavedItem);
router.get('/saved', requireAuth, getSavedItems);

export default router;
