import mongoose from 'mongoose';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { canCancelOrder, canReturnOrder, getMinReturnDays } from '@/lib/orderPolicy';
import type { OrderStatus, ReturnStatus } from '@/types/order';

export class OrderActionError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

async function restoreOrderStock(order: {
  items: { productId: mongoose.Types.ObjectId | string; quantity: number }[];
}) {
  for (const item of order.items) {
    // Step 1: restore stock quantity
    const product = await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stockQuantity: item.quantity } },
      { new: true }
    );

    if (!product) continue;

    // Step 2: decrement soldQuantity but clamp to 0 to avoid negative validation error
    const newSoldQty = Math.max(0, (product.soldQuantity ?? 0) - item.quantity);
    product.soldQuantity = newSoldQty;
    if (product.stockQuantity > 0) {
      product.inStock = true;
    }
    await product.save();
  }
}

export async function restoreOrderStockFromDoc(order: {
  items: { productId: mongoose.Types.ObjectId | string; quantity: number }[];
}) {
  return restoreOrderStock(order);
}

export async function cancelUserOrder(
  userId: string,
  orderId: string,
  reason?: string
) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new OrderActionError('Invalid order', 400, 'INVALID_ORDER');
  }

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    throw new OrderActionError('Order not found', 404, 'NOT_FOUND');
  }

  const returnStatus = (order.returnStatus || 'none') as ReturnStatus;
  if (!canCancelOrder(order.status as OrderStatus, returnStatus)) {
    if (order.status === 'delivered') {
      throw new OrderActionError(
        'This order has been delivered. Please request a return instead.',
        400,
        'ALREADY_DELIVERED'
      );
    }
    if (order.status === 'cancelled') {
      throw new OrderActionError('This order is already cancelled.', 400, 'ALREADY_CANCELLED');
    }
    throw new OrderActionError('This order cannot be cancelled.', 400, 'NOT_CANCELLABLE');
  }

  await restoreOrderStock(order);

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  if (reason?.trim()) order.cancellationReason = reason.trim();
  if (order.paymentStatus === 'paid') {
    order.refundStatus = 'pending';
  }
  await order.save();

  return order.toObject();
}

export async function requestUserReturn(
  userId: string,
  orderId: string,
  reason?: string
) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new OrderActionError('Invalid order', 400, 'INVALID_ORDER');
  }

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    throw new OrderActionError('Order not found', 404, 'NOT_FOUND');
  }

  const returnStatus = (order.returnStatus || 'none') as ReturnStatus;
  const returnDays = getMinReturnDays(
    order.items.map((i) => ({ returnDays: (i as { returnDays?: number }).returnDays }))
  );
  const itemsReturnable = order.items.every(
    (i) => (i as { isReturnable?: boolean }).isReturnable !== false
  );

  if (
    !canReturnOrder(
      order.status as OrderStatus,
      returnStatus,
      order.deliveredAt,
      returnDays,
      itemsReturnable
    )
  ) {
    if (order.status !== 'delivered') {
      throw new OrderActionError(
        'Return is available only after delivery.',
        400,
        'NOT_DELIVERED'
      );
    }
    if (returnStatus !== 'none') {
      throw new OrderActionError('A return has already been requested for this order.', 400, 'RETURN_EXISTS');
    }
    throw new OrderActionError(
      `Return window of ${returnDays} day(s) has expired.`,
      400,
      'RETURN_EXPIRED'
    );
  }

  order.returnStatus = 'requested';
  order.returnRequestedAt = new Date();
  if (reason?.trim()) order.returnReason = reason.trim();
  if (order.paymentStatus === 'paid') {
    order.refundStatus = 'pending';
  }
  await order.save();

  return order.toObject();
}
