import { Router } from 'express';
import { authCheack } from '../middleware/authMiddleware';
import {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  reomveFromWishlist,
  createCashOrder,
} from '../controllers/userController';

const router = Router();

router.post('/user/cart', authCheack, userCart); // save cart
router.get('/user/cart', authCheack, getUserCart); // get cart
router.delete('/user/cart', authCheack, emptyCart); // empty cart
router.post('/user/address', authCheack, saveAddress);

router.post('/user/order', authCheack, createOrder); //stripe
router.post('/user/cash-order', authCheack, createCashOrder); //cod
router.get('/user/orders', authCheack, orders);

// coupon
router.post('/user/cart/coupon', authCheack, applyCouponToUserCart);

// wishlist
router.post('/user/wishlist', authCheack, addToWishlist);
router.get('/user/wishlist', authCheack, wishlist);
router.put('/user/wishlist/:productId', authCheack, reomveFromWishlist);

// router.get('/user', (req, res) => {
//   res.json({
//     data: 'Hey you hit node API user endpoint',
//   });
// });

// module.exports = router;
export default router;
