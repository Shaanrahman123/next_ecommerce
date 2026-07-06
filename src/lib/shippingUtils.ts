import { ShippingSettings, DEFAULT_SHIPPING_SETTINGS } from '@/types/storeSettings';
import { CartItem } from '@/types';

export { DEFAULT_SHIPPING_SETTINGS };

export function calculateShipping(subtotal: number, settings: ShippingSettings): number {
  if (!settings.shippingEnabled) return 0;
  if (subtotal >= settings.freeShippingThreshold) return 0;
  return settings.shippingFee;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  total: number;
  isFreeShipping: boolean;
  amountToFreeShipping: number;
  itemCount: number;
}

export function computeOrderTotals(
  items: CartItem[],
  settings: ShippingSettings = DEFAULT_SHIPPING_SETTINGS
): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = calculateShipping(subtotal, settings);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeShipping = shipping === 0;
  const amountToFreeShipping =
    settings.shippingEnabled && subtotal < settings.freeShippingThreshold
      ? Math.max(0, settings.freeShippingThreshold - subtotal)
      : 0;

  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    isFreeShipping,
    amountToFreeShipping,
    itemCount,
  };
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function getCartItemImage(item: CartItem): string {
  const product = item.product as CartItem['product'] & { heroImageUrl?: string };
  return product.heroImageUrl || product.images?.[0] || '/placeholder-product.jpg';
}
