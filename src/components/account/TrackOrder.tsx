'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Check,
  MapPin,
  Truck,
  Box,
  Home,
  Phone,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { orderService } from '@/services/order.service';
import { getStatusLabel } from '@/lib/orderPolicy';
import type { OrderSummary, OrderStatus } from '@/types/order';

interface TrackOrderProps {
  orderId: string | null;
}

const STATUS_STEPS: { key: OrderStatus; title: string; description: string; icon: typeof Box }[] = [
  { key: 'pending', title: 'Order Placed', description: 'Your order has been received.', icon: Box },
  { key: 'confirmed', title: 'Confirmed', description: 'Order confirmed and being prepared.', icon: Package },
  { key: 'processing', title: 'Processing', description: 'Quality checks and packaging in progress.', icon: Package },
  { key: 'shipped', title: 'Shipped', description: 'On its way to your address.', icon: Truck },
  { key: 'delivered', title: 'Delivered', description: 'Package delivered successfully.', icon: Home },
];

function stepIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1;
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function TrackOrder({ orderId: initialOrderId }: TrackOrderProps) {
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(!!initialOrderId);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(!!initialOrderId);

  const loadOrder = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getOrder(id.trim());
      setOrder(res.data || null);
      setSearching(true);
    } catch {
      setOrder(null);
      setError('Order not found. Check your order ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) loadOrder(initialOrderId);
  }, [initialOrderId]);

  if (searching) {
    if (isLoading) {
      return (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      );
    }

    if (error || !order) {
      return (
        <div className="text-center py-16 px-4 space-y-4">
          <p className="text-gray-500">{error || 'Order not found'}</p>
          <Button variant="outline" onClick={() => { setSearching(false); setError(null); }}>
            Try again
          </Button>
        </div>
      );
    }

    const currentIdx = stepIndex(order.status);
    const addr = order.shippingAddress;
    const isCancelled = order.status === 'cancelled';

    return (
      <div className="animate-fade-in pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 bg-heading rounded-xl flex items-center justify-center text-white shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-heading truncate">Track Order</h1>
              <p className="text-sm text-gray-500">{order.orderNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/account?section=order-details&orderId=${order._id}`}>
              <Button variant="outline" size="sm" className="text-xs font-bold uppercase tracking-wider">
                Order Details
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearching(false); setOrder(null); }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              New Search
            </Button>
          </div>
        </div>

        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200/70 text-sm">
          <span className="font-bold text-heading">Status: </span>
          <span className="text-amber-900">{getStatusLabel(order.status, order.returnStatus)}</span>
        </div>

        {isCancelled ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
            This order was cancelled
            {order.cancelledAt ? ` on ${new Date(order.cancelledAt).toLocaleDateString('en-IN')}` : ''}.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
              <div className="relative space-y-8">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100" />
                {STATUS_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < currentIdx;
                  const isCurrent = index === currentIdx;
                  const date =
                    index === 0
                      ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                      : isCurrent || isCompleted
                        ? new Date(order.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                        : '—';

                  return (
                    <div key={step.key} className="relative flex gap-4 sm:gap-6">
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-heading border-heading text-white'
                            : isCurrent
                              ? 'bg-white border-heading text-heading shadow-md'
                              : 'bg-white border-gray-200 text-gray-300'
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 pt-0.5 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3 className={`text-sm font-bold ${isCompleted || isCurrent ? 'text-heading' : 'text-gray-300'}`}>
                            {step.title}
                          </h3>
                          <span className="text-[11px] font-medium text-gray-400">{date}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-300'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h3 className="text-xs font-bold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-bold text-heading">{addr.fullName}</p>
                <p className="text-gray-600 leading-relaxed">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-gray-600">{addr.addressLine2}</p>}
                <p className="text-gray-600">
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-gray-100 text-gray-500">
                  <Phone className="w-4 h-4 shrink-0" />
                  {addr.phone}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-lg mx-auto py-6 sm:py-10 px-2">
      <Link href="/account?section=orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-heading mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to orders
      </Link>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-heading rounded-xl flex items-center justify-center mx-auto text-white mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-heading mb-2">Track Your Order</h1>
        <p className="text-sm text-gray-500">Enter your order ID to see live status updates.</p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-amber-400/40 outline-none"
        />
        <Button
          fullWidth
          variant="premium"
          size="lg"
          onClick={() => loadOrder(orderId)}
          className="uppercase tracking-wider text-xs"
        >
          <Search className="w-4 h-4 mr-1.5" />
          Track Order
        </Button>
      </div>
    </div>
  );
}
