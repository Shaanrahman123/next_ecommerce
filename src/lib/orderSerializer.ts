import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';
import {
  canCancelOrder,
  canReturnOrder,
  getMinReturnDays,
  getDaysLeftForReturn,
} from '@/lib/orderPolicy';
import type { OrderStatus, ReturnStatus, OrderActions } from '@/types/order';

function toId(value: unknown): string {
  if (value && typeof value === 'object' && '_id' in value) return String((value as { _id: unknown })._id);
  return String(value ?? '');
}

function buildOrderActions(doc: Record<string, unknown>): OrderActions {
  const status = doc.status as OrderStatus;
  const returnStatus = (doc.returnStatus || 'none') as ReturnStatus;
  const items = (doc.items as Record<string, unknown>[]) || [];
  const returnDays = getMinReturnDays(items.map((i) => ({ returnDays: Number(i.returnDays ?? 10) })));
  const itemsReturnable = items.every((i) => i.isReturnable !== false);
  const deliveredAt = doc.deliveredAt as string | Date | undefined;

  const canCancel = canCancelOrder(status, returnStatus);
  const canReturn = canReturnOrder(status, returnStatus, deliveredAt, returnDays, itemsReturnable);
  const returnDaysLeft = canReturn ? getDaysLeftForReturn(deliveredAt, returnDays) : undefined;

  let cancelMessage: string | undefined;
  if (canCancel) {
    cancelMessage =
      status === 'shipped'
        ? 'You can cancel before delivery. If already out for delivery, you may refuse the package at your doorstep.'
        : 'Free cancellation before delivery — same as Flipkart & Myntra.';
  }

  let returnMessage: string | undefined;
  if (canReturn && returnDaysLeft != null) {
    returnMessage = `${returnDaysLeft} day(s) left to return · ${returnDays}-day return policy`;
  }

  return { canCancel, canReturn, returnDaysLeft, cancelMessage, returnMessage };
}

export function serializeOrder(doc: Record<string, unknown>) {
  const items = (doc.items as Record<string, unknown>[]) || [];
  const itemCount = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
  const actions = buildOrderActions(doc);

  return {
    _id: toId(doc._id),
    orderNumber: String(doc.orderNumber),
    status: doc.status,
    returnStatus: doc.returnStatus || 'none',
    refundStatus: doc.refundStatus || 'none',
    paymentStatus: doc.paymentStatus,
    paymentMethod: doc.paymentMethod,
    subtotal: Number(doc.subtotal),
    shipping: Number(doc.shipping),
    total: Number(doc.total),
    itemCount,
    items: items.map((item) => ({
      productId: toId(item.productId),
      name: String(item.name),
      slug: String(item.slug),
      price: Number(item.price),
      originalPrice: item.originalPrice != null ? Number(item.originalPrice) : undefined,
      image: String(item.image),
      size: String(item.size),
      color: String(item.color),
      quantity: Number(item.quantity),
      lineTotal: Number(item.lineTotal),
      returnDays: item.returnDays != null ? Number(item.returnDays) : 10,
      isReturnable: item.isReturnable !== false,
    })),
    shippingAddress: doc.shippingAddress,
    cancellationReason: doc.cancellationReason ? String(doc.cancellationReason) : undefined,
    returnReason: doc.returnReason ? String(doc.returnReason) : undefined,
    cancelledAt: doc.cancelledAt ? new Date(doc.cancelledAt as string).toISOString() : undefined,
    deliveredAt: doc.deliveredAt ? new Date(doc.deliveredAt as string).toISOString() : undefined,
    returnRequestedAt: doc.returnRequestedAt
      ? new Date(doc.returnRequestedAt as string).toISOString()
      : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt as string).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as string).toISOString() : undefined,
    actions,
  };
}

export function serializeOrderListItem(doc: Record<string, unknown>, previewRating?: number) {
  const items = (doc.items as Record<string, unknown>[]) || [];
  const first = items[0];
  const itemCount = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
  const actions = buildOrderActions(doc);

  return {
    _id: toId(doc._id),
    orderNumber: String(doc.orderNumber),
    status: doc.status,
    returnStatus: doc.returnStatus || 'none',
    total: Number(doc.total),
    itemCount,
    createdAt: doc.createdAt ? new Date(doc.createdAt as string).toISOString() : undefined,
    previewItem: first
      ? {
          name: String(first.name),
          image: String(first.image),
          quantity: Number(first.quantity),
          rating: previewRating,
        }
      : undefined,
    actions: { canCancel: actions.canCancel, canReturn: actions.canReturn },
  };
}

export function serializeAdminOrder(doc: Record<string, unknown>) {
  const base = serializeOrder(doc);
  const user = doc.user as Record<string, unknown> | undefined;

  return {
    ...base,
    user: user
      ? {
          _id: toId(user._id),
          firstName: String(user.firstName || ''),
          lastName: String(user.lastName || ''),
          email: String(user.email || ''),
          phone: user.phone ? String(user.phone) : undefined,
        }
      : undefined,
  };
}

export function productImageUrl(heroImage: string, images: string[] = []): string {
  const src = heroImage || images[0] || '';
  if (!src) return '/placeholder-product.jpg';
  if (src.startsWith('http')) return src;
  return getCloudinaryUrl(src, { width: 400, height: 500, crop: 'fill' });
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}${rand}`;
}
