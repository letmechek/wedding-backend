import { Router } from 'express';
import {
  getCategories,
  getListingById,
  getListings,
  getReviews,
  getTrends,
  getVendorById
} from '../controllers/marketplaceController.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/listings', getListings);
router.get('/listings/:id', getListingById);
router.get('/vendors/:id', getVendorById);
router.get('/reviews', getReviews);
router.get('/trends', getTrends);

export default router;
