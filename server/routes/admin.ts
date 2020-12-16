import { Router } from 'express';
import { authCheack, adminCheck } from '../middleware/authMiddleware';

import { orders, orderStatus } from '../controllers/adminController';

const router = Router();

// routes
router.get('/admin/orders', authCheack, adminCheck, orders);
router.put('/admin/order-status', authCheack, adminCheck, orderStatus);

export default router;
