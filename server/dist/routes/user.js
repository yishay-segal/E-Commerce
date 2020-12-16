"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = express_1.Router();
router.post('/user/cart', authMiddleware_1.authCheack, userController_1.userCart); // save cart
router.get('/user/cart', authMiddleware_1.authCheack, userController_1.getUserCart); // get cart
router.delete('/user/cart', authMiddleware_1.authCheack, userController_1.emptyCart); // empty cart
router.post('/user/address', authMiddleware_1.authCheack, userController_1.saveAddress);
router.post('/user/order', authMiddleware_1.authCheack, userController_1.createOrder); //stripe
router.post('/user/cash-order', authMiddleware_1.authCheack, userController_1.createCashOrder); //cod
router.get('/user/orders', authMiddleware_1.authCheack, userController_1.orders);
// coupon
router.post('/user/cart/coupon', authMiddleware_1.authCheack, userController_1.applyCouponToUserCart);
// wishlist
router.post('/user/wishlist', authMiddleware_1.authCheack, userController_1.addToWishlist);
router.get('/user/wishlist', authMiddleware_1.authCheack, userController_1.wishlist);
router.put('/user/wishlist/:productId', authMiddleware_1.authCheack, userController_1.reomveFromWishlist);
// router.get('/user', (req, res) => {
//   res.json({
//     data: 'Hey you hit node API user endpoint',
//   });
// });
// module.exports = router;
exports.default = router;
