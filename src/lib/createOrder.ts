import mongoose from 'mongoose';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { getShippingSettings } from '@/lib/getStoreSettings';
import { calculateShipping } from '@/lib/shippingUtils';
import { MAX_CART_ITEM_QUANTITY, getMaxAllowedQuantity } from '@/constants/cart';
import { generateOrderNumber, productImageUrl } from '@/lib/orderSerializer';
import type { CreateOrderPayload } from '@/types/order';

export class OrderError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export async function createOrder(userId: string, payload: CreateOrderPayload) {
  const { items, shippingAddress, paymentMethod = 'cod' } = payload;

  if (!items?.length) {
    throw new OrderError('Cart is empty', 400, 'EMPTY_CART');
  }

  if (!shippingAddress?.fullName || !shippingAddress.addressLine1 || !shippingAddress.phone) {
    throw new OrderError('Complete shipping address is required', 400, 'INVALID_ADDRESS');
  }

  const productIds = items.map((i) => i.productId);
  const uniqueIds = [...new Set(productIds)];

  let products;
  try {
    products = await Product.find({
      _id: { $in: uniqueIds },
      isActive: true,
    }).lean();
  } catch {
    throw new OrderError('Invalid product in cart', 400, 'INVALID_PRODUCT');
  }

  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const orderItems: {
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
    returnDays?: number;
    isReturnable?: boolean;
  }[] = [];

  let subtotal = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new OrderError(`Product not available: ${item.productId}`, 400, 'PRODUCT_NOT_FOUND');
    }

    if (!product.inStock || product.stockQuantity <= 0) {
      throw new OrderError(`${product.name} is out of stock`, 400, 'OUT_OF_STOCK');
    }

    const qty = Math.floor(Number(item.quantity));
    if (qty < 1) {
      throw new OrderError('Invalid quantity', 400, 'INVALID_QUANTITY');
    }

    const maxAllowed = getMaxAllowedQuantity(product.stockQuantity);
    if (qty > maxAllowed) {
      if (product.stockQuantity < MAX_CART_ITEM_QUANTITY) {
        throw new OrderError(
          `Only ${product.stockQuantity} unit(s) of "${product.name}" available in stock`,
          400,
          'INSUFFICIENT_STOCK'
        );
      }
      throw new OrderError(
        `Maximum ${MAX_CART_ITEM_QUANTITY} units allowed per product for "${product.name}"`,
        400,
        'MAX_QUANTITY_EXCEEDED'
      );
    }

    const lineTotal = product.price * qty;
    subtotal += lineTotal;

    orderItems.push({
      productId: product._id as mongoose.Types.ObjectId,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: productImageUrl(product.heroImage, product.images),
      size: item.size || 'One Size',
      color: item.color || 'Default',
      quantity: qty,
      lineTotal,
      returnDays: (product as { returnDays?: number }).returnDays ?? 10,
      isReturnable: (product as { isReturnable?: boolean }).isReturnable !== false,
    });
  }

  const shippingSettings = await getShippingSettings();
  const shipping = calculateShipping(subtotal, shippingSettings);
  const total = subtotal + shipping;

  const orderNumber = generateOrderNumber();

  const decremented: { productId: string; quantity: number }[] = [];

  try {
    for (const line of orderItems) {
      const pid = String(line.productId);
      const updated = await Product.findOneAndUpdate(
        {
          _id: line.productId,
          stockQuantity: { $gte: line.quantity },
          isActive: true,
        },
        {
          $inc: { stockQuantity: -line.quantity, soldQuantity: line.quantity },
        },
        { new: true }
      );

      if (!updated) {
        throw new OrderError(
          `Insufficient stock for "${line.name}". Please update your cart.`,
          409,
          'STOCK_CHANGED'
        );
      }

      if (updated.stockQuantity <= 0) {
        updated.inStock = false;
        await updated.save();
      }

      decremented.push({ productId: pid, quantity: line.quantity });
    }

    const order = await Order.create({
      orderNumber,
      user: userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping,
      total,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    return order.toObject();
  } catch (err) {
    for (const d of decremented) {
      await Product.findByIdAndUpdate(d.productId, {
        $inc: { stockQuantity: d.quantity, soldQuantity: -d.quantity },
        $set: { inStock: true },
      });
    }
    if (err instanceof OrderError) throw err;
    throw new OrderError('Failed to place order. Please try again.', 500, 'ORDER_FAILED');
  }
}
