import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISpecialOffer extends Document {
  badge: string;           // e.g. "Limited Time"
  heading: string;         // e.g. "Special"
  headingAccent: string;   // e.g. "Offers"
  subtitle: string;        // e.g. "Festive deals you don't want to miss."
  isActive: boolean;
  offers: {
    icon: string;          // lucide icon name e.g. "Tag", "TrendingUp", "Zap", "Gift"
    title: string;
    description: string;
    link: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const OfferItemSchema = new Schema(
  {
    icon: { type: String, required: true, default: 'Tag' },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    link: { type: String, required: true, default: '/products' },
  },
  { _id: false }
);

const SpecialOfferSchema = new Schema(
  {
    badge: { type: String, default: 'Limited Time', trim: true },
    heading: { type: String, default: 'Special', trim: true },
    headingAccent: { type: String, default: 'Offers', trim: true },
    subtitle: { type: String, default: "Festive deals you don't want to miss.", trim: true },
    isActive: { type: Boolean, default: true },
    offers: { type: [OfferItemSchema], default: [] },
  },
  { timestamps: true }
);

const SpecialOffer: Model<ISpecialOffer> =
  mongoose.models.SpecialOffer || mongoose.model<ISpecialOffer>('SpecialOffer', SpecialOfferSchema);

export default SpecialOffer;
