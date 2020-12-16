import mongoose, { Schema, Document } from 'mongoose';
// const { ObjectId } = Schema.Types;\

interface CategoryIn extends Document {
  name: string;
  slug: string;
}

const categorySchema: Schema = new Schema(
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
  },
  { timestamps: true }
);

export default mongoose.model<CategoryIn>('Category', categorySchema);
