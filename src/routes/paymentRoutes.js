import { Router } from 'express';
import { createPaymentIntent, getPaymentIntentStatus } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = Router();

router.post('/create-intent', requireAuth, requireRole('client'), createPaymentIntent);
router.get('/intent/:paymentIntentId', requireAuth, requireRole('client'), getPaymentIntentStatus);

export default router;
