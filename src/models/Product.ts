import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  heroImage: string;
  images: string[];
  superCategories: mongoose.Types.ObjectId[];
  categories: mongoose.Types.ObjectId[];
  subCategories: mongoose.Types.ObjectId[];
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  featured: boolean;
  homeSections?: string[];
  gender: 'men' | 'women' | 'kids' | 'unisex';
  sizes?: string[];
  colors?: string[];
  colorVariants?: { name: string; hex: string }[];
  brand?: string;
  material?: string;
  season?: string;
  specifications?: { key: string; value: string }[];
  ratings: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
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
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    heroImage: {
      type: String,
      required: [true, 'Hero image is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    superCategories: {
      type: [{ type: Schema.Types.ObjectId, ref: 'SuperCategory' }],
      required: [true, 'Super Category is required'],
      validate: {
        validator: function(val: any) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'At least one Super Category is required'
      }
    },
    categories: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
      required: [true, 'Category is required'],
      validate: {
        validator: function(val: any) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'At least one Category is required'
      }
    },
    subCategories: {
      type: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Stock quantity cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    homeSections: {
      type: [String],
      default: [],
      enum: {
        values: [
          'trending-accessories',
          'trending-indian-wear',
          'trending-sports-wear',
          'trending-footwear',
        ],
        message: 'Invalid home page section',
      },
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'kids', 'unisex'],
      default: 'unisex',
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    colorVariants: [
      {
        name: { type: String, required: true, trim: true },
        hex: { type: String, default: '#000000', trim: true },
      },
    ],
    brand: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    season: {
      type: String,
      trim: true,
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      }
    ],
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
