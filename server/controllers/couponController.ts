import Coupon from '../models/couponModel';
import { Request, Response } from 'express';

// create remove list
export const create = async (req: Request, res: Response) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    res.json(await new Coupon({ name, expiry, discount }).save());
  } catch (error) {
    console.error(error);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec());
  } catch (error) {
    console.error(error);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
  } catch (error) {
    console.error(error);
  }
};
