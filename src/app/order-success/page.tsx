'use client';

import { useEffect, useState, Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Check,
  Package,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Loader2,
  MapPin,
  CreditCard,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { IndianPatternOverlay } from '@/components/home/indian/IndianDecor';
import { orderService } from '@/services/order.service';
import { formatINR } from '@/lib/shippingUtils';
import type { OrderSummary, OrderStatus } from '@/types/order';

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-800 border-amber-200/80' },
  confirmed: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
  processing: { label: 'Processing', className: 'bg-sky-50 text-sky-800 border-sky-200/80' },
  shipped: { label: 'Shipped', className: 'bg-indigo-50 text-indigo-800 border-indigo-200/80' },
  delivered: { label: 'Delivered', className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200/80' },
};

function SuccessIcon() {
  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-24 h-24 rounded-full border border-emerald-300/40"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
        className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-linear-to-br from-emerald-50 to-emerald-100 border border-emerald-200/80 shadow-[0_8px_28px_rgba(16,185,129,0.15)] flex items-center justify-center"
      >
        <Check className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600" strokeWidth={2.5} />
      </motion.div>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon,
  loading,
  highlight,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white border border-amber-200/60 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
        {icon}
        {label}
      </div>
      {loading ? (
        <div className="h-6 w-24 bg-gray-200/80 rounded animate-pulse" />
      ) : (
        <p className={`font-bold text-heading ${highlight ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'}`}>
          {value}
        </p>
      )}
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) return;
    orderService
      .getOrder(orderId)
      .then((res) => setOrder(res.data || null))
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  const orderNumber = order?.orderNumber || '—';
  const statusStyle = order ? STATUS_STYLES[order.status] : STATUS_STYLES.pending;
  const items = order?.items ?? [];

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-12">
      {/* Header — same width rhythm as checkout */}
      <div className="relative bg-[#faf7f2] border-b border-amber-200/50 pt-6 pb-8 overflow-hidden">
        <IndianPatternOverlay pattern="bandhani" className="text-amber-900" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 md:gap-8 text-center sm:text-left"
          >
            <SuccessIcon />
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-200/70 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-900 mb-3">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Order confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight mb-2">
                Thank you for your order!
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                We&apos;ve received your order and will begin processing it shortly. Your confirmation is saved in
                your account.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main content — full container width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left — order details (wider column) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="lg:col-span-8 space-y-5 sm:space-y-6 order-last lg:order-0"
          >
            {/* Stats grid */}
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatTile
                label="Order #"
                value={<span className="font-mono text-xs sm:text-sm break-all">{orderNumber}</span>}
                icon={<Package className="w-3.5 h-3.5" />}
                loading={isLoading && !!orderId}
              />
              <StatTile
                label="Items"
                value={order?.itemCount ?? '—'}
                icon={<ShoppingBag className="w-3.5 h-3.5" />}
                loading={isLoading && !!orderId}
              />
              <StatTile
                label="Total paid"
                value={order ? formatINR(order.total) : '—'}
                icon={<CreditCard className="w-3.5 h-3.5" />}
                loading={isLoading && !!orderId}
                highlight
              />
              <StatTile
                label="Status"
                value={
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusStyle.className}`}
                  >
                    {statusStyle.label}
                  </span>
                }
                icon={<Sparkles className="w-3.5 h-3.5" />}
                loading={isLoading && !!orderId}
              />
            </div>

            {/* Items list — full width table-style */}
            {items.length > 0 && (
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-sm">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />
                <div className="px-5 py-4 border-b border-amber-100/80">
                  <h2 className="text-xs font-bold text-heading uppercase tracking-[0.15em]">Order items</h2>
                </div>
                <div className="divide-y divide-amber-100/80">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-3 min-[480px]:gap-4 px-4 sm:px-5 py-4"
                    >
                      <div className="flex items-center gap-3 min-[480px]:gap-4 flex-1 min-w-0">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-amber-200/60 bg-gray-50 shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-heading line-clamp-2 sm:truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 wrap-break-word">
                            Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-heading min-[480px]:text-right pl-15 min-[480px]:pl-0 shrink-0">
                        {formatINR(item.lineTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address + delivery — side by side on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order?.shippingAddress && (
                <div className="rounded-2xl border border-amber-200/70 bg-[#faf8f5] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-amber-700/70" />
                    <h3 className="text-xs font-bold text-heading uppercase tracking-[0.12em]">Delivering to</h3>
                  </div>
                  <p className="text-sm font-bold text-heading">{order.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm font-semibold text-heading mt-2">{order.shippingAddress.phone}</p>
                </div>
              )}

              <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-[0.12em]">Delivery</h3>
                </div>
                <p className="text-sm text-emerald-900/90 leading-relaxed">
                  Estimated delivery in{' '}
                  <strong className="font-bold text-emerald-900">3–5 business days</strong>. We&apos;ll notify you
                  when your order ships.
                </p>
                <p className="text-xs text-emerald-800/70 mt-2 capitalize">
                  Payment: {order?.paymentMethod?.replace(/_/g, ' ') || 'Cash on delivery'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — actions sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
            className="lg:col-span-4 order-first lg:order-0"
          >
            <div className="lg:sticky lg:top-8 space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-white p-5 sm:p-6 shadow-[0_8px_32px_rgba(180,83,9,0.06)]">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />
                <h2 className="text-xs font-bold text-heading uppercase tracking-[0.15em] mb-4 sm:mb-5">
                  What&apos;s next?
                </h2>

                <div className="flex flex-col gap-4">
                  <Link
                    href={orderId ? `/account?section=order-details&orderId=${orderId}` : '/account?section=orders'}
                    className="block w-full"
                  >
                    <Button fullWidth variant="premium" size="lg" className="uppercase tracking-widest text-xs sm:text-sm">
                      View Order
                      <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
                    </Button>
                  </Link>
                  <Link href="/products" className="block w-full">
                    <Button
                      fullWidth
                      variant="premium-outline"
                      size="lg"
                      className="uppercase tracking-widest text-xs sm:text-sm"
                    >
                      <ShoppingBag className="w-4 h-4 mr-1.5 shrink-0" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-amber-100/80 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your payment &amp; details are secure</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <Package className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Each order is carefully packed by hand</span>
                  </div>
                </div>
              </div>

              {order && (
                <div className="rounded-2xl border border-amber-200/50 bg-[#faf8f5] px-5 py-4 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Order total</p>
                  <p className="text-2xl font-black text-heading">{formatINR(order.total)}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function OrderSuccessFallback() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <Loader2 className="w-8 h-8 animate-spin text-amber-600/60" />
      <p className="text-sm text-gray-500 font-medium mt-4">Loading your order…</p>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
