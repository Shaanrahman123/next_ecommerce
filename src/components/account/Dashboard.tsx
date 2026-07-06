'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UserCircle,
  Lock,
  Package,
  MapPin,
  Headphones,
  Heart,
  ShoppingBag,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { orderService } from '@/services/order.service';
import { formatINR } from '@/lib/shippingUtils';
import { formatRelativeDate, getStatusLabel } from '@/lib/orderPolicy';
import type { OrderListItem, OrderStatus, ReturnStatus } from '@/types/order';

function statusPillClass(status: OrderStatus, returnStatus?: ReturnStatus) {
  if (returnStatus === 'requested') return 'text-amber-700 bg-amber-50 border-amber-200';
  if (status === 'delivered') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (status === 'shipped') return 'text-indigo-700 bg-indigo-50 border-indigo-200';
  if (status === 'cancelled') return 'text-red-600 bg-red-50 border-red-200';
  if (status === 'processing' || status === 'confirmed') return 'text-sky-700 bg-sky-50 border-sky-200';
  return 'text-amber-800 bg-amber-50 border-amber-200';
}

export default function Dashboard() {
  const [recentOrders, setRecentOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dashboardItems = [
    { label: 'My Orders', icon: Package, link: '/account?section=orders' },
    { label: 'My Wishlist', icon: Heart, link: '/wishlist' },
    { label: 'My Addresses', icon: MapPin, link: '/account?section=addresses' },
    { label: 'Update Profile', icon: UserCircle, link: '/account?section=profile' },
    { label: 'Change Password', icon: Lock, link: '/account?section=password' },
    { label: 'Support', icon: Headphones, link: '/account?section=support' },
  ];

  const loadRecent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderService.listOrders();
      setRecentOrders((res.data || []).slice(0, 3));
    } catch {
      setRecentOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="hidden lg:block">
        <h1 className="text-2xl font-bold text-heading mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back! Manage your account and orders.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {dashboardItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.link}
              className="bg-white border border-gray-200 rounded-xl p-4 lg:p-5 transition-all group flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left lg:justify-between hover:border-amber-300/60 hover:shadow-sm"
            >
              <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3">
                <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-heading group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs lg:text-sm font-bold text-heading">{item.label}</p>
              </div>
              <ChevronRight className="hidden lg:block w-4 h-4 text-gray-300 group-hover:text-heading" />
            </Link>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-heading uppercase tracking-wider border-l-4 border-heading pl-3">
            Recent Orders
          </h2>
          <Link
            href="/account?section=orders"
            className="text-xs font-bold text-heading hover:underline uppercase tracking-wider"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">No orders yet</p>
            <Link href="/products" className="text-sm font-bold text-heading hover:underline">
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const preview = order.previewItem;
              const label = getStatusLabel(order.status, order.returnStatus);

              return (
                <Link
                  key={order._id}
                  href={`/account?section=order-details&orderId=${order._id}`}
                  className="flex items-center gap-3 sm:gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-amber-300/70 hover:shadow-sm transition-all"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                    {preview?.image ? (
                      <Image src={preview.image} alt="" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-heading truncate">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} · {formatRelativeDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-heading">{formatINR(order.total)}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${statusPillClass(order.status, order.returnStatus)}`}
                    >
                      {label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
