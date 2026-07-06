import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategoryFilterField extends Document {
  subCategory: mongoose.Types.ObjectId;
  key: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryFilterFieldSchema: Schema = new Schema(
  {
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: [true, 'Sub category is required'],
    },
    key: {
      type: String,
      required: [true, 'Filter key is required'],
      trim: true,
    },
    label: {
      type: String,
      required: [true, 'Filter label is required'],
      trim: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CategoryFilterFieldSchema.index({ subCategory: 1, key: 1 }, { unique: true });

const CategoryFilterField: Model<ICategoryFilterField> =
  mongoose.models.CategoryFilterField ||
  mongoose.model<ICategoryFilterField>('CategoryFilterField', CategoryFilterFieldSchema);

export default CategoryFilterField;
