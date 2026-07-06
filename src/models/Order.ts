import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type ReturnStatus = 'none' | 'requested' | 'approved' | 'completed' | 'rejected';

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    image: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
    returnDays: { type: Number, default: 10, min: 0 },
    isReturnable: { type: Boolean, default: true },
  },
  { _id: false }
);

const OrderAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    type: { type: String, default: 'HOME' },
  },
  { _id: false }
);

export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: string;
    size: string;
    color: string;
    quantity: number;
    lineTotal: number;
    returnDays: number;
    isReturnable: boolean;
  }[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email?: string;
    type?: string;
  };
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  returnStatus: ReturnStatus;
  refundStatus?: 'none' | 'pending' | 'processed';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  cancellationReason?: string;
  returnReason?: string;
  cancelledAt?: Date;
  deliveredAt?: Date;
  returnRequestedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [OrderItemSchema], required: true, validate: [(v: unknown[]) => v.length > 0, 'Order must have items'] },
    shippingAddress: { type: OrderAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    returnStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'completed', 'rejected'],
      default: 'none',
    },
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'processed'],
      default: 'none',
    },
    paymentMethod: { type: String, default: 'cod' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    cancellationReason: { type: String, default: '' },
    returnReason: { type: String, default: '' },
    cancelledAt: { type: Date },
    deliveredAt: { type: Date },
    returnRequestedAt: { type: Date },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
