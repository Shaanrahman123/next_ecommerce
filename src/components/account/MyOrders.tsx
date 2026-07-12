'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Calendar, Loader2, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import OrderActionButtons from '@/components/account/OrderActionButtons';
import OrderItemReviews from '@/components/account/OrderItemReviews';
import { orderService } from '@/services/order.service';
import { formatINR } from '@/lib/shippingUtils';
import { getStatusLabel } from '@/lib/orderPolicy';
import type { OrderListItem, OrderSummary, OrderStatus, ReturnStatus } from '@/types/order';

function statusInfo(status: OrderStatus, returnStatus?: ReturnStatus) {
  const label = getStatusLabel(status, returnStatus);
  if (returnStatus === 'requested') return { label, color: 'text-amber-700 bg-amber-50 border-amber-200' };
  if (status === 'delivered') return { label, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (status === 'shipped') return { label, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  if (status === 'cancelled') return { label, color: 'text-red-600 bg-red-50 border-red-200' };
  if (status === 'processing' || status === 'confirmed') return { label, color: 'text-sky-700 bg-sky-50 border-sky-200' };
  return { label, color: 'text-amber-800 bg-amber-50 border-amber-200' };
}

export default function MyOrders() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandMode, setExpandMode] = useState<'actions' | 'reviews' | null>(null);
  const [actionOrder, setActionOrder] = useState<OrderSummary | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderService.listOrders();
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openExpanded = async (orderId: string, mode: 'actions' | 'reviews', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (expandedId === orderId && expandMode === mode) {
      setExpandedId(null);
      setExpandMode(null);
      setActionOrder(null);
      return;
    }
    try {
      const res = await orderService.getOrder(orderId);
      setActionOrder(res.data || null);
      setExpandedId(orderId);
      setExpandMode(mode);
    } catch {
      setExpandedId(null);
      setExpandMode(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl p-12 text-center border border-gray-200 bg-white">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-heading mb-2">No orders yet</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          You haven&apos;t placed any orders. Start exploring our collection.
        </p>
        <Link href="/products">
          <Button variant="premium" size="lg" className="uppercase tracking-wider text-xs">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-6">
      <h1 className="hidden lg:block text-xl font-bold text-heading mb-6">My Orders</h1>

      <div className="space-y-3 lg:space-y-4">
        {orders.map((order) => {
          const status = statusInfo(order.status, order.returnStatus);
          const preview = order.previewItem;
          const hasActions = order.actions?.canCancel || order.actions?.canReturn;

          return (
            <div
              key={order._id}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-sm transition-shadow"
            >
              <Link
                href={`/account?section=order-details&orderId=${order._id}`}
                className="flex gap-3 sm:gap-4 p-4 sm:p-5 items-center group"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-200">
                  {preview?.image ? (
                    <Image src={preview.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-7 h-7 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-400">{order.orderNumber}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-heading truncate">
                    {preview?.name || 'Order'}
                    {order.itemCount > 1 && ` + ${order.itemCount - 1} more`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </span>
                    <span className="font-bold text-heading">{formatINR(order.total)}</span>
                  </div>
                  
                  {order.status === 'delivered' && preview && (
                    <div className="mt-3 flex items-center gap-1.5 group/stars cursor-pointer" onClick={(e) => openExpanded(order._id, 'reviews', e)}>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-4 h-4 transition-colors ${
                              preview.rating && s <= preview.rating
                                ? 'fill-amber-400 text-amber-400' 
                                : 'text-gray-300 group-hover/stars:text-amber-400 group-hover/stars:fill-amber-400'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover/stars:text-amber-600 ml-1">
                        {preview.rating ? 'Review Submitted' : 'Rate Order'}
                      </span>
                    </div>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-heading shrink-0" />
              </Link>

              {expandedId === order._id && actionOrder && expandMode === 'reviews' && (
                <div className="px-4 sm:px-5 pb-5">
                  <OrderItemReviews 
                    order={actionOrder} 
                    onReviewSubmitted={() => {
                      fetchOrders();
                    }} 
                  />
                </div>
              )}

              {hasActions && (
                <div className="px-4 sm:px-5 pb-4 border-t border-gray-100 pt-3">
                  {expandedId === order._id && actionOrder && expandMode === 'actions' ? (
                    <OrderActionButtons
                      order={actionOrder}
                      onUpdated={(updated) => {
                        setActionOrder(updated);
                        fetchOrders();
                      }}
                      layout="row"
                      size="sm"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => openExpanded(order._id, 'actions', e)}
                      className="text-xs font-bold text-amber-900 hover:underline uppercase tracking-wider"
                    >
                      Cancel / Return options
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
