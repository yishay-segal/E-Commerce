import mongoose, { Schema, Document, Types } from 'mongoose';
const { ObjectId } = Schema.Types;

interface CategoryIn extends Document {
  name: string;
  slug: string;
  parent: Types.ObjectId;
}

const subSchema: Schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
      minlength: [2, 'Too short'],
      maxlength: [32, 'Too long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: { type: ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<CategoryIn>('Sub', subSchema);
