import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICmsPage extends Document {
  slug: string;
  title: string;
  metaDescription?: string;
  content: string; // HTML/rich text content
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CmsPageSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const CmsPage: Model<ICmsPage> =
  mongoose.models.CmsPage || mongoose.model<ICmsPage>('CmsPage', CmsPageSchema);

export default CmsPage;
