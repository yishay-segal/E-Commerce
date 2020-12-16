import mongoose, { Schema, Document, Types } from 'mongoose';
const { ObjectId } = Schema.Types;

interface ProductIn extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  quntity: number;
  sold: number;
  images: [];
  shipping: string;
  color: string;
  brand: string;
  ratings: [
    {
      postedBy: Types.ObjectId;
      star: number;
    }
  ];
}

const productSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
    },
    subs: [
      {
        type: ObjectId,
        ref: 'Sub',
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ['Yes', 'No'],
    },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    },
    brand: {
      type: String,
      enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ProductIn>('Product', productSchema);
