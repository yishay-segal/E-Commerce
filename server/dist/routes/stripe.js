"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const stripeController_1 = require("../controllers/stripeController");
const router = express_1.Router();
router.post('/create-payment-intent', authMiddleware_1.authCheack, stripeController_1.createPaymentIntent);
exports.default = router;
