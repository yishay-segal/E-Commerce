import mongoose, { Schema, Document } from 'mongoose';
const { ObjectId } = Schema.Types;

interface userIn extends Document {
  name: string;
  email: string;
  role: string;
  cart: [];
  address: string;
  wishlist: string[];
}

const userSchema: Schema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: 'subscriber',
    },
    cart: {
      type: Array,
      default: [],
    },
    address: String,
    wishlist: [{ type: ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

export default mongoose.model<userIn>('User', userSchema);
