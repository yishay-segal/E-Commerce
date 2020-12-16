"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const stripe_1 = __importDefault(require("stripe"));
const secret = process.env.STRIPE_SECRET;
const stripe = new stripe_1.default(secret, {
    apiVersion: '2020-08-27',
});
exports.createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const { couponApplied } = req.body;
    //later apply coupon
    // later calculate price
    // 1. find user
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    // 2. get user cart total
    const cart = yield cartModel_1.default.findOne({ orderedBy: user === null || user === void 0 ? void 0 : user._id }).exec();
    const { cartTotal, totalAfterDiscount } = cart;
    // console.log('cart total charged ', cartTotal);
    let finalAmount = 0;
    if (couponApplied && totalAfterDiscount) {
        finalAmount = totalAfterDiscount * 100;
    }
    else {
        finalAmount = cartTotal * 100;
    }
    // create payment intent with order amount and currency
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: finalAmount,
        currency: 'usd',
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable: finalAmount,
    });
});
