import { Router } from 'express';
import { login, logout, me, refresh, register } from '../controllers/authController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', optionalAuth, logout);
router.get('/me', requireAuth, me);
router.post('/refresh', refresh);

export default router;
