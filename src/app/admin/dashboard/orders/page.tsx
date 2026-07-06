'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Loader2,
  Search,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { orderService } from '@/services/order.service';
import { formatINR } from '@/lib/shippingUtils';
import type { AdminOrderListItem, OrderStatus, ReturnStatus, RefundStatus } from '@/types/order';

const STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const RETURN_STATUS_COLORS: Record<string, string> = {
  none: 'bg-gray-50 text-gray-500 border-gray-200',
  requested: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const REFUND_STATUS_COLORS: Record<string, string> = {
  none: 'bg-gray-50 text-gray-500 border-gray-200',
  pending: 'bg-orange-50 text-orange-800 border-orange-200',
  processed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderListItem | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingReturn, setIsUpdatingReturn] = useState(false);
  const [isUpdatingRefund, setIsUpdatingRefund] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderService.admin.listOrders({
        page,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setOrders((res.data as AdminOrderListItem[]) || []);
      setTotalPages((res.meta?.totalPages as number) || 1);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchOrders, search]);

  const openDetail = async (id: string) => {
    try {
      const res = await orderService.admin.getOrder(id);
      if (res.data) setSelectedOrder(res.data as AdminOrderListItem);
    } catch {
      /* ignore */
    }
  };

  const handleStatusChange = async (status: OrderStatus) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const res = await orderService.admin.updateStatus(selectedOrder._id, status);
      if (res.data) {
        setSelectedOrder(res.data as AdminOrderListItem);
        fetchOrders();
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReturnStatusChange = async (returnStatus: ReturnStatus) => {
    if (!selectedOrder) return;
    setIsUpdatingReturn(true);
    try {
      const res = await orderService.admin.updateOrderFields(selectedOrder._id, { returnStatus });
      if (res.data) {
        setSelectedOrder(res.data as AdminOrderListItem);
        fetchOrders();
      }
    } finally {
      setIsUpdatingReturn(false);
    }
  };

  const handleRefundStatusChange = async (refundStatus: RefundStatus) => {
    if (!selectedOrder) return;
    setIsUpdatingRefund(true);
    try {
      const res = await orderService.admin.updateOrderFields(selectedOrder._id, { refundStatus });
      if (res.data) {
        setSelectedOrder(res.data as AdminOrderListItem);
        fetchOrders();
      }
    } finally {
      setIsUpdatingRefund(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading font-heading">Orders</h1>
        <p className="text-gray-500">Manage customer orders, update status, and view full details</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order #, name, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as OrderStatus | '');
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none bg-white"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value || 'all'} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Order</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Items</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Return / Refund</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => openDetail(order._id)}
                    className="hover:bg-gray-50/60 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-heading">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      {order.user ? (
                        <div>
                          <p className="text-sm font-medium text-heading">
                            {order.user.firstName} {order.user.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{order.user.email}</p>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.itemCount}</td>
                    <td className="px-6 py-4 text-sm font-bold text-heading">{formatINR(order.total)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-600'}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {order.returnStatus && order.returnStatus !== 'none' && (
                          <span
                            className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${RETURN_STATUS_COLORS[order.returnStatus] || ''}`}
                          >
                            Return: {order.returnStatus}
                          </span>
                        )}
                        {order.refundStatus && order.refundStatus !== 'none' && (
                          <span
                            className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${REFUND_STATUS_COLORS[order.refundStatus] || ''}`}
                          >
                            Refund: {order.refundStatus}
                          </span>
                        )}
                        {order.status === 'cancelled' && (!order.refundStatus || order.refundStatus === 'none') && (
                          <span className="text-[9px] text-red-600 font-semibold uppercase">Cancelled</span>
                        )}
                        {(!order.returnStatus || order.returnStatus === 'none') &&
                          (!order.refundStatus || order.refundStatus === 'none') &&
                          order.status !== 'cancelled' && (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 border border-gray-100 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 border border-gray-100 rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-100 flex items-end lg:items-center justify-center p-0 lg:p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full lg:max-w-4xl max-h-[92vh] bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold text-heading">{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-gray-500">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Update status</label>
                <select
                  value={selectedOrder.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold"
                >
                  {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {isUpdatingStatus && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
              </div>

              {(selectedOrder.status === 'cancelled' ||
                (selectedOrder.returnStatus && selectedOrder.returnStatus !== 'none') ||
                (selectedOrder.refundStatus && selectedOrder.refundStatus !== 'none')) && (
                <div className="rounded-xl border border-amber-200/70 bg-amber-50/30 p-4 space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase">Cancellation &amp; Returns</h3>

                  {selectedOrder.status === 'cancelled' && (
                    <div className="text-sm">
                      <p className="font-semibold text-red-700">Order cancelled</p>
                      {selectedOrder.cancelledAt && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(selectedOrder.cancelledAt).toLocaleString('en-IN')}
                        </p>
                      )}
                      {selectedOrder.cancellationReason && (
                        <p className="text-sm text-gray-600 mt-2">
                          Reason: {selectedOrder.cancellationReason}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedOrder.returnStatus && selectedOrder.returnStatus !== 'none' && (
                    <div className="space-y-2">
                      {selectedOrder.returnReason && (
                        <p className="text-sm text-gray-600">Return reason: {selectedOrder.returnReason}</p>
                      )}
                      {selectedOrder.returnRequestedAt && (
                        <p className="text-xs text-gray-500">
                          Requested: {new Date(selectedOrder.returnRequestedAt).toLocaleString('en-IN')}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Return status</label>
                        <select
                          value={selectedOrder.returnStatus}
                          disabled={isUpdatingReturn}
                          onChange={(e) => handleReturnStatusChange(e.target.value as ReturnStatus)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold bg-white"
                        >
                          <option value="requested">Requested</option>
                          <option value="approved">Approved</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {isUpdatingReturn && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/50">
                    <label className="text-xs font-bold text-gray-500 uppercase">Refund status</label>
                    <select
                      value={selectedOrder.refundStatus || 'none'}
                      disabled={isUpdatingRefund}
                      onChange={(e) => handleRefundStatusChange(e.target.value as RefundStatus)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold bg-white"
                    >
                      <option value="none">None</option>
                      <option value="pending">Pending</option>
                      <option value="processed">Processed</option>
                    </select>
                    {isUpdatingRefund && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                  </div>
                </div>
              )}

              {selectedOrder.user && (
                <div className="rounded-xl border border-gray-100 p-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Customer
                  </h3>
                  <p className="font-semibold text-heading">
                    {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedOrder.user.email}
                  </p>
                  {selectedOrder.user.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedOrder.user.phone}
                    </p>
                  )}
                </div>
              )}

              <div className="rounded-xl border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Shipping Address
                </h3>
                <p className="font-semibold">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedOrder.shippingAddress.addressLine1}
                  {selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ''}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.zipCode}
                </p>
                <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.phone}</p>
              </div>

              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <h3 className="text-xs font-bold text-gray-400 uppercase p-4 border-b border-gray-50 bg-gray-50/50">
                  Order Items
                </h3>
                <div className="divide-y divide-gray-50">
                  {selectedOrder.items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="p-4 flex gap-4">
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border">
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-heading text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.size} · {item.color} · Qty {item.quantity}
                        </p>
                        <p className="text-sm font-bold mt-1">{formatINR(item.lineTotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">{formatINR(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-semibold">
                    {selectedOrder.shipping === 0 ? 'FREE' : formatINR(selectedOrder.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatINR(selectedOrder.total)}</span>
                </div>
                <p className="text-xs text-gray-400 pt-1">
                  Payment: {selectedOrder.paymentMethod} · {selectedOrder.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
