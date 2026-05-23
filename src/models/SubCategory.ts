import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  superCategories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Sub Category name is required'],
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
    superCategories: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'SuperCategory'
      }],
      required: [true, 'Super Categories are required'],
      validate: {
        validator: function(val: any) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'At least one Super Category is required'
      }
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory: Model<ISubCategory> =
  mongoose.models.SubCategory || mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);

export default SubCategory;
