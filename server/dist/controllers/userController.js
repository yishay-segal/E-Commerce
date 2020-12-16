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
exports.createCashOrder = exports.reomveFromWishlist = exports.wishlist = exports.addToWishlist = exports.orders = exports.createOrder = exports.applyCouponToUserCart = exports.saveAddress = exports.emptyCart = exports.getUserCart = exports.userCart = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const couponModel_1 = __importDefault(require("../models/couponModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const uniqueid_1 = __importDefault(require("uniqueid"));
exports.userCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart } = req.body;
    let products = [];
    console.log('email', req.body);
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    console.log('user', user);
    // check if cart with logged in user id already exist
    let cartExistByThisUser = yield cartModel_1.default.findOne({ orderedBy: user === null || user === void 0 ? void 0 : user._id }).exec();
    // reomve old cart
    if (cartExistByThisUser)
        cartExistByThisUser.remove();
    for (let item of cart) {
        let object = {};
        object.product = item._id;
        object.count = item.count;
        object.color = item.color;
        // get price for creating total
        const productFromDb = yield productModel_1.default.findById(item._id)
            .select('price')
            .exec();
        object.price = productFromDb === null || productFromDb === void 0 ? void 0 : productFromDb.price;
        products.push(object);
    }
    let cartTotal = 0;
    for (let item of products) {
        cartTotal += item.price * item.count;
    }
    // console.log(user?._id);
    let newCart = yield new cartModel_1.default({
        products,
        cartTotal,
        orderedBy: user === null || user === void 0 ? void 0 : user._id,
    }).save();
    // console.log('new cart --->', newCart);
    res.json({ ok: true });
});
exports.getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    let cart = yield cartModel_1.default.findOne({ orderedBy: user === null || user === void 0 ? void 0 : user._id })
        .populate('products.product', '_id title price totalAfterDiscount')
        .exec();
    console.log(cart);
    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });
});
exports.emptyCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    const cart = yield cartModel_1.default.findOneAndRemove({ orderedBy: user === null || user === void 0 ? void 0 : user._id }).exec();
    res.json(cart);
});
exports.saveAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAddress = yield userModel_1.default.findOneAndUpdate({ email: req.user.email }, { address: req.body.address }).exec();
    res.json({ ok: true });
});
exports.applyCouponToUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon } = req.body;
    console.log('Coupon', coupon);
    const validCoupon = yield couponModel_1.default.findOne({ name: coupon }).exec();
    if (!validCoupon) {
        return res.json({
            err: 'Invalid coupon',
        });
    }
    // console.log('Valid coupon', validCoupon);
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    const cart = yield cartModel_1.default.findOne({ orderedBy: user === null || user === void 0 ? void 0 : user._id })
        .populate('products.product', '_id title price')
        .exec();
    const { products, cartTotal } = cart;
    // console.log('cartTotal', cartTotal, 'discount', validCoupon.discount);
    // calculate the total after discount
    const calc = (cartTotal -
        (cartTotal * validCoupon.discount) / 100).toFixed(2);
    const totalAfterDiscount = parseInt(calc);
    console.log(totalAfterDiscount);
    cartModel_1.default.findOneAndUpdate({ orderedBy: user === null || user === void 0 ? void 0 : user._id }, { totalAfterDiscount }, { new: true }).exec();
    res.json(totalAfterDiscount);
});
exports.createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentIntent } = req.body.stripeResponse;
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    const cart = yield cartModel_1.default.findOne({ orderedBy: user === null || user === void 0 ? void 0 : user._id }).exec();
    const { products } = cart;
    const newOrder = yield new orderModel_1.default({
        products,
        paymentIntent,
        orderedBy: user === null || user === void 0 ? void 0 : user._id,
    }).save();
    // decrement quantity, increment sold
    const bulkOption = products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });
    const updated = productModel_1.default.bulkWrite(bulkOption, {});
    console.log('Product quantity-- and sold++', updated);
    console.log('New order saved', newOrder);
    res.json({ ok: true });
});
exports.orders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    const userOrders = yield orderModel_1.default.find({ orderedBy: user === null || user === void 0 ? void 0 : user._id })
        .populate('products.product')
        .exec();
    res.json(userOrders);
});
exports.addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const user = yield userModel_1.default.findOneAndUpdate({ email: req.user.email }, { $addToSet: { wishlist: productId } }).exec();
    res.json({ ok: true });
});
exports.wishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield userModel_1.default.findOne({ email: req.user.email })
        .select('wishlist')
        .populate('wishlist')
        .exec();
    res.json(list);
});
exports.reomveFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const user = yield userModel_1.default.findOneAndUpdate({ email: req.user.email }, { $pull: { wishlist: productId } }).exec();
    res.json({ ok: true });
});
exports.createCashOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { COD, couponApplied } = req.body;
    if (!COD)
        return res.status(400).send('Create cash order failed');
    // if cod is true, create order with status of cash on delivery
    const user = yield userModel_1.default.findOne({ email: req.user.email }).exec();
    const cart = yield cartModel_1.default.findOne({ orderedBy: user === null || user === void 0 ? void 0 : user._id }).exec();
    const { products, totalAfterDiscount, cartTotal } = cart;
    let finalAmount = 0;
    if (couponApplied && totalAfterDiscount) {
        finalAmount = totalAfterDiscount * 100;
    }
    else {
        finalAmount = cartTotal * 100;
    }
    const newOrder = yield new orderModel_1.default({
        products,
        paymentIntent: {
            id: uniqueid_1.default(),
            amount: finalAmount,
            currency: 'usd',
            status: 'Cash On Delivery',
            created: Date.now(),
            payment_method_types: ['Cash'],
        },
        orderedBy: user === null || user === void 0 ? void 0 : user._id,
        orderStatus: 'Cash On Delivery',
    }).save();
    // decrement quantity, increment sold
    const bulkOption = products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });
    const updated = productModel_1.default.bulkWrite(bulkOption, {});
    console.log('Product quantity-- and sold++', updated);
    console.log('New order saved', newOrder);
    res.json({ ok: true });
});
