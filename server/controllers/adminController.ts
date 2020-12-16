import Order from '../models/orderModel';
import { Request, Response } from 'express';

export const orders = async (req: Request, res: Response) => {
  const allOrders = await Order.find({})
    .sort('-createdAt')
    .populate('products.product')
    .exec();

  res.json(allOrders);
};

export const orderStatus = async (req: Request, res: Response) => {
  const { orderId, orderStatus } = req.body;

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec();

  res.json(updated);
};
