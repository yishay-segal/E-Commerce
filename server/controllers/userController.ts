import User from '../models/userModel';
import Product from '../models/productModel';
import Cart from '../models/cartModel';
import { Request, Response } from 'express';
import Coupon from '../models/couponModel';
import Order from '../models/orderModel';
import uniqueid from 'uniqueid';
// import { Types } from 'mongoose';

interface obj {
  price?: number;
  product?: any;
  count?: number;
  color?: string;
}

export const userCart = async (req: Request, res: Response) => {
  const { cart } = req.body;

  let products = [];

  console.log('email', req.body);
  const user = await User.findOne({ email: req.user.email }).exec();
  console.log('user', user);

  // check if cart with logged in user id already exist
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user?._id }).exec();

  // reomve old cart
  if (cartExistByThisUser) cartExistByThisUser.remove();

  for (let item of cart) {
    let object: obj = {};

    object.product = item._id;
    object.count = item.count;
    object.color = item.color;

    // get price for creating total
    const productFromDb = await Product.findById(item._id)
      .select('price')
      .exec();
    object.price = productFromDb?.price;

    products.push(object);
  }

  let cartTotal = 0;
  for (let item of products) {
    cartTotal += item.price! * item.count!;
  }

  // console.log(user?._id);
  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user?._id,
  }).save();

  // console.log('new cart --->', newCart);
  res.json({ ok: true });
};

export const getUserCart = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderedBy: user?._id })
    .populate('products.product', '_id title price totalAfterDiscount')
    .exec();

  console.log(cart);
  const { products, cartTotal, totalAfterDiscount } = cart!;
  res.json({ products, cartTotal, totalAfterDiscount });
};

export const emptyCart = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndRemove({ orderedBy: user?._id }).exec();
  res.json(cart);
};

export const saveAddress = async (req: Request, res: Response) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

export const applyCouponToUserCart = async (req: Request, res: Response) => {
  const { coupon } = req.body;
  console.log('Coupon', coupon);

  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (!validCoupon) {
    return res.json({
      err: 'Invalid coupon',
    });
  }

  // console.log('Valid coupon', validCoupon);

  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOne({ orderedBy: user?._id })
    .populate('products.product', '_id title price')
    .exec();
  const { products, cartTotal } = cart!;

  // console.log('cartTotal', cartTotal, 'discount', validCoupon.discount);

  // calculate the total after discount
  const calc: string = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  const totalAfterDiscount = parseInt(calc);
  console.log(totalAfterDiscount);

  Cart.findOneAndUpdate(
    { orderedBy: user?._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json(totalAfterDiscount);
};

export const createOrder = async (req: Request, res: Response) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOne({ orderedBy: user?._id }).exec();
  const { products } = cart!;

  const newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user?._id,
  }).save();

  // decrement quantity, increment sold
  const bulkOption = products.map((item: any) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  const updated = Product.bulkWrite(bulkOption, {});
  console.log('Product quantity-- and sold++', updated);

  console.log('New order saved', newOrder);

  res.json({ ok: true });
};

export const orders = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const userOrders = await Order.find({ orderedBy: user?._id })
    .populate('products.product')
    .exec();

  res.json(userOrders);
};

export const addToWishlist = async (req: Request, res: Response) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

export const wishlist = async (req: Request, res: Response) => {
  const list = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist')
    .exec();

  res.json(list);
};

export const reomveFromWishlist = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

export const createCashOrder = async (req: Request, res: Response) => {
  const { COD, couponApplied } = req.body;

  if (!COD) return res.status(400).send('Create cash order failed');

  // if cod is true, create order with status of cash on delivery

  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOne({ orderedBy: user?._id }).exec();
  const { products, totalAfterDiscount, cartTotal } = cart!;

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  const newOrder = await new Order({
    products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: 'usd',
      status: 'Cash On Delivery',
      created: Date.now(),
      payment_method_types: ['Cash'],
    },
    orderedBy: user?._id,
    orderStatus: 'Cash On Delivery',
  }).save();

  // decrement quantity, increment sold
  const bulkOption = products.map((item: any) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  const updated = Product.bulkWrite(bulkOption, {});
  console.log('Product quantity-- and sold++', updated);

  console.log('New order saved', newOrder);

  res.json({ ok: true });
};
