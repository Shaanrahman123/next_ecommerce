export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type ReturnStatus = 'none' | 'requested' | 'approved' | 'completed' | 'rejected';
export type RefundStatus = 'none' | 'pending' | 'processed';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderLineItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  lineTotal: number;
  returnDays?: number;
  isReturnable?: boolean;
}

export interface OrderAddressSnapshot {
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
}

export interface OrderActions {
  canCancel: boolean;
  canReturn: boolean;
  returnDaysLeft?: number;
  cancelMessage?: string;
  returnMessage?: string;
}

export interface OrderSummary {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  returnStatus: ReturnStatus;
  refundStatus?: RefundStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  items: OrderLineItem[];
  shippingAddress: OrderAddressSnapshot;
  cancellationReason?: string;
  returnReason?: string;
  cancelledAt?: string;
  deliveredAt?: string;
  returnRequestedAt?: string;
  createdAt: string;
  updatedAt: string;
  actions?: OrderActions;
}

export interface OrderListItem {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  returnStatus?: ReturnStatus;
  total: number;
  itemCount: number;
  createdAt: string;
  previewItem?: {
    name: string;
    image: string;
    quantity: number;
  };
  actions?: Pick<OrderActions, 'canCancel' | 'canReturn'>;
}

export interface CreateOrderPayload {
  items: { productId: string; size: string; color: string; quantity: number }[];
  shippingAddress: OrderAddressSnapshot;
  paymentMethod?: string;
}

export interface AdminOrderListItem extends OrderSummary {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}
