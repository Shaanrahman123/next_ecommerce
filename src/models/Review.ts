import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReviewStatus = 'published' | 'hidden';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  orderNumber: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderNumber: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '', trim: true, maxlength: 120 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['published', 'hidden'], default: 'published', index: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ user: 1, order: 1, product: 1, size: 1, color: 1 }, { unique: true });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
