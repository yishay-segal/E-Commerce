import User from '../models/userModel';
import Cart from '../models/cartModel';
import Product from '../models/productModel';
import Coupon from '../models/couponModel';
import Stripe from 'stripe';
import { Request, Response } from 'express';

const secret = process.env.STRIPE_SECRET!;
const stripe = new Stripe(secret, {
  apiVersion: '2020-08-27',
});

export const createPaymentIntent = async (req: Request, res: Response) => {
  // console.log(req.body);
  const { couponApplied } = req.body;
  //later apply coupon
  // later calculate price

  // 1. find user
  const user = await User.findOne({ email: req.user.email }).exec();

  // 2. get user cart total
  const cart = await Cart.findOne({ orderedBy: user?._id }).exec();
  const { cartTotal, totalAfterDiscount } = cart!;
  // console.log('cart total charged ', cartTotal);

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  // create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: 'usd',
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
