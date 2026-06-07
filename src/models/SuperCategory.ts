import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISuperCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const SuperCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Super Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SuperCategory: Model<ISuperCategory> =
  mongoose.models.SuperCategory || mongoose.model<ISuperCategory>('SuperCategory', SuperCategorySchema);

export default SuperCategory;
