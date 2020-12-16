import mongoose, { Schema, Document, Types } from 'mongoose';
const { ObjectId } = Schema.Types;

interface CartIn extends Document {
  products: [
    {
      product: Types.ObjectId;
      count: number;
      color: string;
      price: number;
    }
  ];
  cartTotal: number;
  totalAfterDiscount: number;
  orderedBy: Types.ObjectId;
}

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model<CartIn>('Cart', cartSchema);
