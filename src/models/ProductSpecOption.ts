import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductSpecOption extends Document {
  key: string;
  value: string;
  subCategory?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSpecOptionSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: [true, 'Spec key is required'],
      trim: true,
    },
    value: {
      type: String,
      required: [true, 'Spec value is required'],
      trim: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      default: null,
    },
  },
  { timestamps: true }
);

ProductSpecOptionSchema.index(
  { key: 1, value: 1, subCategory: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

const ProductSpecOption: Model<IProductSpecOption> =
  mongoose.models.ProductSpecOption ||
  mongoose.model<IProductSpecOption>('ProductSpecOption', ProductSpecOptionSchema);

export default ProductSpecOption;
