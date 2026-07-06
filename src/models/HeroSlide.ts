import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeroSlide extends Document {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    link: {
      type: String,
      required: [true, 'Link is required'],
      trim: true,
      default: '/products',
    },
    buttonText: {
      type: String,
      trim: true,
      default: 'Shop Collection',
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

const HeroSlide: Model<IHeroSlide> =
  mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);

export default HeroSlide;
