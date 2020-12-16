import { Router } from 'express';
import { authCheack } from '../middleware/authMiddleware';

import { createPaymentIntent } from '../controllers/stripeController';
const router = Router();

router.post('/create-payment-intent', authCheack, createPaymentIntent);

export default router;
