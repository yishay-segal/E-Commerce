"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controllers
const couponController_1 = require("../controllers/couponController");
// middleware
const authMiddleware_1 = require("../middleware/authMiddleware");
// routes
const router = express_1.Router();
router.post('/coupon', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, couponController_1.create);
router.get('/coupons', couponController_1.list);
router.delete('/coupon/:couponId', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, couponController_1.remove);
// module.exports = router;
exports.default = router;
