"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = express_1.Router();
// routes
router.get('/admin/orders', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, adminController_1.orders);
router.put('/admin/order-status', authMiddleware_1.authCheack, authMiddleware_1.adminCheck, adminController_1.orderStatus);
exports.default = router;
