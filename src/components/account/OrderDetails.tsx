'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Calendar,
  Truck,
  Loader2,
  ArrowLeft,
  RotateCcw,
  XCircle,
  CreditCard,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import OrderActionButtons from '@/components/account/OrderActionButtons';
import OrderItemReviews from '@/components/account/OrderItemReviews';
import { orderService } from '@/services/order.service';
import { formatINR } from '@/lib/shippingUtils';
import { getStatusLabel } from '@/lib/orderPolicy';
import type { OrderSummary, OrderStatus, ReturnStatus } from '@/types/order';

interface OrderDetailsProps {
  orderId: string | null;
}

function statusBadgeClass(status: OrderStatus, returnStatus?: ReturnStatus) {
  if (returnStatus === 'requested') return 'bg-amber-50 text-amber-800 border-amber-300';
  if (returnStatus === 'completed') return 'bg-purple-50 text-purple-800 border-purple-200';
  if (status === 'delivered') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (status === 'shipped') return 'bg-indigo-50 text-indigo-800 border-indigo-200';
  if (status === 'cancelled') return 'bg-red-50 text-red-700 border-red-200';
  if (status === 'processing' || status === 'confirmed') return 'bg-sky-50 text-sky-800 border-sky-200';
  return 'bg-amber-50 text-amber-800 border-amber-200';
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setError('Order not found');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await orderService.getOrder(orderId);
      setOrder(res.data || null);
      setError(null);
    } catch {
      setError('Could not load order');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600/50" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16 space-y-4 px-4">
        <p className="text-gray-500">{error || 'Order not found'}</p>
        <Link href="/account?section=orders">
          <Button variant="outline">Back to orders</Button>
        </Link>
      </div>
    );
  }

  const addr = order.shippingAddress;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const statusLabel = getStatusLabel(order.status, order.returnStatus);
  const showActions = order.actions?.canCancel || order.actions?.canReturn;

  return (
    <div className="animate-fade-in pb-8">

      {/* ── Page header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-linear-to-br from-[#faf8f5] via-white to-amber-50/40 p-4 sm:p-5 mb-5 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Link
              href="/account?section=orders"
              className="mt-0.5 flex items-center justify-center w-9 h-9 rounded-xl border border-amber-200/80 bg-white text-heading hover:bg-amber-50 transition-colors shrink-0"
              aria-label="Back to all orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-base sm:text-lg font-bold text-heading truncate">{order.orderNumber}</h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${statusBadgeClass(order.status, order.returnStatus)}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                Placed on {orderDate}
              </p>
            </div>
          </div>
          <Link href="/account?section=orders" className="hidden sm:block shrink-0">
            <Button variant="premium-outline" size="sm" className="gap-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
              <ArrowLeft className="w-3.5 h-3.5" />
              All Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Status strip ── */}
      <div className="rounded-2xl border border-amber-200/70 bg-white p-4 sm:p-5 mb-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

          {/* Date */}
          <div className="hidden sm:block">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order date</p>
            <p className="text-sm font-semibold text-heading flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {orderDate}
            </p>
          </div>

          {/* Payment */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-heading capitalize leading-tight">{order.paymentMethod}</p>
                <p className="text-xs text-gray-400 capitalize">{order.paymentStatus}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total</p>
            <p className="text-lg font-bold text-heading">{formatINR(order.total)}</p>
          </div>
        </div>

        {/* Info messages */}
        {order.actions?.cancelMessage && order.actions.canCancel && (
          <p className="mt-4 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 leading-relaxed">
            {order.actions.cancelMessage}
          </p>
        )}
        {order.actions?.returnMessage && order.actions.canReturn && (
          <p className="mt-4 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded-xl px-3 py-2.5 leading-relaxed flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            {order.actions.returnMessage}
          </p>
        )}
        {order.status === 'cancelled' && order.cancelledAt && (
          <p className="mt-4 text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            Cancelled on {new Date(order.cancelledAt).toLocaleDateString('en-IN')}
            {order.cancellationReason ? ` · ${order.cancellationReason}` : ''}
          </p>
        )}
        {order.returnStatus === 'requested' && (
          <p className="mt-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            Return requested — our team will contact you within 24–48 hours.
          </p>
        )}

        {/* Action buttons — inline on all screen sizes */}
        {showActions && (
          <div className="mt-5 pt-4 border-t border-amber-100">
            <OrderActionButtons order={order} onUpdated={setOrder} layout="row" />
          </div>
        )}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">

        {/* Order items + reviews */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-amber-200/70 bg-white overflow-hidden shadow-sm">
            <div className="px-4 sm:px-5 py-3.5 border-b border-amber-100/80 bg-[#faf8f5]">
              <h2 className="text-xs font-bold text-heading uppercase tracking-wider">
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-amber-100/60">
              {order.items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="p-4 sm:p-5 flex gap-3 sm:gap-4 hover:bg-amber-50/30 transition-colors"
                >
                  <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border border-amber-200/50 bg-gray-50 shrink-0 shadow-sm">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="text-sm sm:text-base font-bold text-heading line-clamp-2 hover:text-amber-900 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.size && (
                        <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                          Color: {item.color}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    {item.isReturnable !== false && (item.returnDays ?? 0) > 0 && (
                      <p className="text-[11px] text-amber-800 mt-2 font-medium">
                        {item.returnDays}-day return eligible
                      </p>
                    )}
                    <p className="text-base font-bold text-heading mt-2">{formatINR(item.lineTotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <OrderItemReviews order={order} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Delivery address */}
          <div className="rounded-2xl border border-amber-200/70 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="text-xs font-bold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-700" />
              Delivery Address
            </h3>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-heading">{addr.fullName}</p>
              <p className="text-gray-600 leading-relaxed">{addr.addressLine1}</p>
              {addr.addressLine2 && <p className="text-gray-600">{addr.addressLine2}</p>}
              <p className="text-gray-600">
                {addr.city}, {addr.state} {addr.zipCode}
              </p>
              <p className="text-gray-600">{addr.country}</p>
              <div className="pt-3 mt-2 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 shrink-0" />
                {addr.phone}
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div className="rounded-2xl border border-amber-200/70 bg-heading text-white p-4 sm:p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-60">Price Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between opacity-80">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Shipping</span>
                <span className={order.shipping === 0 ? 'text-emerald-400 font-semibold' : ''}>
                  {order.shipping === 0 ? 'FREE' : formatINR(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2.5 border-t border-white/15">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Track button */}
          <Link href={`/account?section=track-order&orderId=${order._id}`} className="block">
            <Button fullWidth variant="premium" size="lg" className="uppercase tracking-wider text-xs">
              <Truck className="w-4 h-4 mr-1.5" />
              Track Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
