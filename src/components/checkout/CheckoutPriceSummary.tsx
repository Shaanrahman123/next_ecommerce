'use client';

import { CartItem } from '@/types';
import { OrderTotals, formatINR } from '@/lib/shippingUtils';
import { getMinReturnDays } from '@/lib/orderPolicy';
import type { ShippingSettings } from '@/types/storeSettings';
import Button from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface CheckoutPriceSummaryProps {
  items: CartItem[];
  totals: OrderTotals;
  settings: ShippingSettings;
  isLoading?: boolean;
  isProcessing?: boolean;
  onPlaceOrder?: () => void;
  showPlaceOrder?: boolean;
  actionLabel?: string;
  compact?: boolean;
}

export default function CheckoutPriceSummary({
  items,
  totals,
  settings,
  isLoading,
  isProcessing,
  onPlaceOrder,
  showPlaceOrder = true,
  actionLabel = 'Place Order',
  compact = false,
}: CheckoutPriceSummaryProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-[0_8px_32px_rgba(180,83,9,0.06)] ${
        compact ? 'p-5' : 'p-6'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

      <h2 className="text-xs font-bold text-heading mb-5 uppercase tracking-[0.15em]">Price Details</h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-amber-600/50" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const lineTotal = item.product.price * item.quantity;
            return (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex justify-between gap-3 text-sm"
              >
                <span className="text-gray-500 line-clamp-1 flex-1">
                  {item.product.name}
                  {item.quantity > 1 && (
                    <span className="text-gray-400"> × {item.quantity}</span>
                  )}
                </span>
                <span className="font-semibold text-heading shrink-0">{formatINR(lineTotal)}</span>
              </div>
            );
          })}

          <div className="border-t border-amber-100/80 pt-3 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal ({totals.itemCount} items)</span>
              <span className="font-semibold text-heading">{formatINR(totals.subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Shipping Fee</span>
              {!settings.shippingEnabled ? (
                <span className="font-semibold text-gray-500">Not applicable</span>
              ) : totals.isFreeShipping ? (
                <span className="font-bold text-emerald-600">FREE</span>
              ) : (
                <span className="font-semibold text-heading">{formatINR(totals.shipping)}</span>
              )}
            </div>

            {totals.amountToFreeShipping > 0 && (
              <p className="text-[11px] text-amber-800/80 bg-amber-50/80 border border-amber-200/60 rounded-lg px-3 py-2 leading-relaxed">
                Add {formatINR(totals.amountToFreeShipping)} more for{' '}
                <span className="font-bold">free shipping</span> on orders above{' '}
                {formatINR(settings.freeShippingThreshold)}
              </p>
            )}

            {(() => {
              const returnDays = getMinReturnDays(
                items.map((i) => ({
                  returnDays: (i.product as { returnDays?: number }).returnDays ?? 10,
                  isReturnable: (i.product as { isReturnable?: boolean }).isReturnable,
                }))
              );
              const anyReturnable = items.some(
                (i) => (i.product as { isReturnable?: boolean }).isReturnable !== false && returnDays > 0
              );
              if (!anyReturnable) return null;
              return (
                <p className="text-[11px] text-emerald-800/90 bg-emerald-50/80 border border-emerald-200/60 rounded-lg px-3 py-2 leading-relaxed flex items-start gap-2">
                  <span className="font-bold shrink-0">✓</span>
                  <span>
                    Eligible for <span className="font-bold">{returnDays}-day easy return</span> after delivery (as per
                    Indian e-commerce standard).
                  </span>
                </p>
              );
            })()}
          </div>

          <div className="border-t border-amber-100/80 pt-4">
            <div className="flex justify-between items-baseline">
              <span className={`font-bold text-heading uppercase ${compact ? 'text-sm' : 'text-base'}`}>
                Total Amount
              </span>
              <span className={`font-black text-heading ${compact ? 'text-xl' : 'text-2xl'}`}>
                {formatINR(totals.total)}
              </span>
            </div>
          </div>

          {showPlaceOrder && onPlaceOrder && (
            <Button
              fullWidth
              variant="premium"
              size="xl"
              onClick={onPlaceOrder}
              isLoading={isProcessing}
              className="mt-4 uppercase tracking-widest text-sm"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
