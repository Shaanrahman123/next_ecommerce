import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreSettings extends Document {
  key: string;
  shippingEnabled: boolean;
  freeShippingThreshold: number;
  shippingFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema(
  {
    key: { type: String, default: 'default', unique: true },
    shippingEnabled: { type: Boolean, default: true },
    freeShippingThreshold: { type: Number, default: 999, min: 0 },
    shippingFee: { type: Number, default: 75, min: 0 },
  },
  { timestamps: true }
);

const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);

export default StoreSettings;
