import mongoose, { Schema, Document, Types } from 'mongoose';
const { ObjectId } = Schema.Types;

interface OrderIn extends Document {
  products: [
    {
      product: Types.ObjectId;
      count: number;
      color: string;
      price: number;
    }
  ];
  paymentIntent: any;
  orderStatus: string;
  orderedBy: Types.ObjectId;
}

const orderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: 'Not Processed',
      enum: [
        'Not Processed',
        'Processing',
        'Dispatched',
        'Cancelled',
        'Completed',
        'Cash On Delivery',
      ],
    },
    orderedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model<OrderIn>('Order', orderSchema);
