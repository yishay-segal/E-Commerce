import mongoose, { Schema, Document, Types } from 'mongoose';
const { ObjectId } = Schema.Types;

interface CouponIn extends Document {
  name: string;
  expiry: Date;
  discount: number;
}

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: 'Name is required',
      minlength: [6, 'Too short'],
      maxlength: [16, 'Too long'],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<CouponIn>('Coupon', couponSchema);
