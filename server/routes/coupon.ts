import { Router } from 'express';
// controllers
import { create, remove, list } from '../controllers/couponController';
// middleware
import { authCheack, adminCheck } from '../middleware/authMiddleware';

// routes
const router = Router();
router.post('/coupon', authCheack, adminCheck, create);
router.get('/coupons', list);
router.delete('/coupon/:couponId', authCheack, adminCheck, remove);

// module.exports = router;
export default router;
