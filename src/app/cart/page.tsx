'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, ChevronRight, Info, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { useCartProductSync } from '@/hooks/useCartProductSync';
import { computeOrderTotals } from '@/lib/shippingUtils';
import { getMaxAllowedQuantity } from '@/constants/cart';
import CheckoutItemRow from '@/components/checkout/CheckoutItemRow';
import CheckoutPriceSummary from '@/components/checkout/CheckoutPriceSummary';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import { IndianPatternOverlay } from '@/components/home/indian/IndianDecor';
import AlertModal from '@/components/ui/AlertModal';
import { formatINR } from '@/lib/shippingUtils';

export default function CartPage() {
  const router = useRouter();
  const { items, isLoading: productsLoading, getItemStock, removeItem, updateQuantity, clearCart } =
    useCartProductSync();
  const { settings, isLoading: settingsLoading } = useShippingSettings();
  const totals = useMemo(() => computeOrderTotals(items, settings), [items, settings]);

  const [qtyAlert, setQtyAlert] = useState<string | null>(null);

  const handleIncreaseQty = (productId: string, size: string, color: string, currentQty: number) => {
    const stock = getItemStock(productId);
    const max = getMaxAllowedQuantity(stock);
    if (currentQty >= max) return;
    updateQuantity(productId, size, color, currentQty + 1);
  };

  const summaryLoading = productsLoading || settingsLoading;

  if (!productsLoading && items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center pt-24 lg:pt-32 px-4">
        <div className="text-center max-w-md w-full animate-fade-in">
          <div className="w-20 h-20 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-9 h-9 text-amber-700/40" />
          </div>
          <h1 className="text-2xl font-bold text-heading mb-2">Your cart is empty</h1>
          <p className="text-sm text-gray-500 mb-8">Add some premium pieces to your collection.</p>
          <Link href="/products">
            <Button variant="premium" size="lg" fullWidth className="uppercase tracking-widest text-xs">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-12">
      {/* Header — matches checkout */}
      <div className="relative bg-white border-b border-amber-200/50 pt-5 pb-6 overflow-hidden">
        <IndianPatternOverlay pattern="bandhani" className="text-amber-900" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-sm font-bold text-heading uppercase tracking-[0.2em]">Shopping Cart</h1>
              <p className="text-xs text-gray-500 mt-1">
                {productsLoading ? 'Loading cart…' : `${totals.itemCount} item${totals.itemCount !== 1 ? 's' : ''} · Review before checkout`}
              </p>
            </div>
            <button
              type="button"
              onClick={clearCart}
              disabled={productsLoading}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline w-fit disabled:opacity-50"
            >
              Clear cart
            </button>
          </div>
          <CheckoutStepper currentStep={1} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative overflow-hidden bg-white border border-amber-200/70 rounded-2xl p-5 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-heading uppercase tracking-wide">Items in your cart</h2>
                <span className="text-xs text-amber-800/60 font-semibold">
                  {productsLoading ? '…' : `${totals.itemCount} item(s)`}
                </span>
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-7 h-7 animate-spin text-amber-600/50" />
                </div>
              ) : (
                items.map((item) => (
                  <CheckoutItemRow
                    key={`${item.productId}-${item.size}-${item.color}`}
                    item={item}
                    stockQuantity={getItemStock(item.productId)}
                    onRemove={() => removeItem(item.productId, item.size, item.color)}
                    onDecrease={() => {
                      if (item.quantity <= 1) {
                        removeItem(item.productId, item.size, item.color);
                      } else {
                        updateQuantity(item.productId, item.size, item.color, item.quantity - 1);
                      }
                    }}
                    onIncrease={() => handleIncreaseQty(item.productId, item.size, item.color, item.quantity)}
                    onLimitReached={setQtyAlert}
                  />
                ))
              )}
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-heading transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue shopping
            </Link>

            {/* Mobile summary */}
            <div className="lg:hidden" id="cart-price-summary">
              <CheckoutPriceSummary
                items={items}
                totals={totals}
                settings={settings}
                isLoading={summaryLoading}
                showPlaceOrder={false}
                compact
              />
            </div>
          </div>

          {/* Desktop summary */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <CheckoutPriceSummary
                items={items}
                totals={totals}
                settings={settings}
                isLoading={summaryLoading}
                showPlaceOrder={false}
              />
              <Button
                fullWidth
                variant="premium"
                size="xl"
                onClick={() => router.push('/checkout')}
                disabled={productsLoading || items.length === 0}
                className="uppercase tracking-widest text-sm"
              >
                Proceed to Checkout
                <ChevronRight className="w-4 h-4 ml-1 inline" />
              </Button>
              <div className="flex flex-col gap-2 px-1">
                <p className="text-[11px] text-gray-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Secure checkout
                </p>
                <p className="text-[11px] text-gray-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Estimated delivery 3–5 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar — matches checkout */}
      <div className="lg:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-heading">
                {summaryLoading ? '…' : formatINR(totals.total)}
              </span>
              <button
                type="button"
                onClick={() => document.getElementById('cart-price-summary')?.scrollIntoView({ behavior: 'smooth' })}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Info className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
          <Button
            variant="premium"
            size="lg"
            onClick={() => router.push('/checkout')}
            disabled={productsLoading || items.length === 0}
            className="flex-1 max-w-[220px] uppercase tracking-widest text-xs"
          >
            Checkout
          </Button>
        </div>
      </div>

      <AlertModal
        isOpen={!!qtyAlert}
        title="Quantity limit"
        message={qtyAlert || ''}
        variant="warning"
        onClose={() => setQtyAlert(null)}
      />
    </div>
  );
}
