'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, ShoppingBag, Calendar, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/store';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { mockOrders } from '@/data/orders';

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'delivered':
                return {
                    icon: <CheckCircle className="w-4 h-4" />,
                    color: 'text-green-600 bg-green-50 border-green-100',
                    label: 'Delivered'
                };
            case 'shipped':
                return {
                    icon: <Package className="w-4 h-4" />,
                    color: 'text-blue-600 bg-blue-50 border-blue-100',
                    label: 'Shipped'
                };
            case 'processing':
                return {
                    icon: <Clock className="w-4 h-4" />,
                    color: 'text-yellow-600 bg-yellow-50 border-yellow-100',
                    label: 'Processing'
                };
            case 'cancelled':
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    color: 'text-red-600 bg-red-50 border-red-100',
                    label: 'Cancelled'
                };
            default:
                return {
                    icon: <Clock className="w-4 h-4" />,
                    color: 'text-gray-600 bg-gray-50 border-gray-100',
                    label: status.charAt(0).toUpperCase() + status.slice(1)
                };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                    <div>
                        <h1 className="text-page-title text-gray-900 mb-2">My Orders</h1>
                        <p className="text-body text-gray-500 max-w-lg">
                            Track, view, and manage your orders. We'll keep you updated on your delivery status.
                        </p>
                    </div>
                    <Link href="/products" className="shrink-0">
                        <Button variant="outline" size="lg" className="rounded-xl border-gray-200 h-12 md:h-14 px-8 font-bold text-body flex items-center justify-center gap-3">
                            <ShoppingBag className="w-5 h-5" />
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                {mockOrders.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 md:p-24 text-center shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                            <Package className="w-12 h-12" />
                        </div>
                        <h2 className="text-section-title font-bold text-gray-900 mb-4">No orders placed yet</h2>
                        <p className="text-body text-gray-500 mb-10 max-w-sm mx-auto">
                            It looks like you haven't made any purchases. Explore our latest arrivals to find something you'll love.
                        </p>
                        <Link href="/products">
                            <Button size="lg" className="rounded-2xl px-12 h-14 text-body font-black uppercase tracking-widest shadow-xl shadow-black/10">
                                Explore Products
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 md:space-y-8">
                        {mockOrders.map((order) => {
                            const status = getStatusInfo(order.status);
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white border border-gray-100 rounded-4xl overflow-hidden shadow-sm transition-all duration-500 animate-fade-in group"
                                >
                                    {/* Desktop Horizontal Layout */}
                                    <div className="hidden md:flex items-stretch divide-x divide-gray-50">
                                        {/* Product Preview (Left Side) - 60% */}
                                        <div className="flex-[1.5] p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <p className="text-small font-bold text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                                                        <div className="flex items-center gap-2 text-body font-bold text-gray-900">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                    <div className="w-px h-10 bg-gray-100" />
                                                    <div>
                                                        <p className="text-small font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                                        <div className="text-body font-black text-gray-900">#{order.id.split('-')[1]}</div>
                                                    </div>
                                                </div>
                                                <span className={`px-4 py-2 rounded-xl text-small font-bold border flex items-center gap-2 uppercase tracking-widest ${status.color}`}>
                                                    {status.icon}
                                                    {status.label}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="relative w-28 h-36 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                                                    <Image
                                                        src={order.products[0].image}
                                                        alt={order.products[0].name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-card-title font-bold text-gray-900 mb-2 leading-tight">
                                                        {order.products[0].name}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="text-small font-bold text-gray-500 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100">Size: {order.products[0].size}</span>
                                                        <span className="text-small font-bold text-gray-500 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100">Qty: {order.products[0].quantity}</span>
                                                    </div>
                                                    {order.products.length > 1 && (
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex -space-x-3">
                                                                {order.products.slice(1, 4).map((p, i) => (
                                                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-50 relative shadow-sm">
                                                                        <Image src={p.image} alt="" fill className="object-cover" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <p className="text-small font-bold text-gray-400">+{order.products.length - 1} more items</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financials & Actions (Right Side) - 40% */}
                                        <div className="flex-1 bg-gray-50/30 p-8 flex flex-col justify-center">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-small font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                        <p className="text-price font-black text-gray-900">₹{order.total.toLocaleString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-small font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                                                        <div className="flex items-center gap-2 text-small font-bold text-gray-700">
                                                            <CreditCard className="w-3.5 h-3.5" />
                                                            Card Payment
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-6 flex flex-col gap-3">
                                                    <Link href={`/account?section=order-details&orderId=${order.id}`} className="w-full">
                                                        <Button fullWidth size="lg" className="rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg shadow-black/5 flex items-center justify-center">
                                                            Track Order
                                                        </Button>
                                                    </Link>
                                                    <Button variant="outline" fullWidth size="lg" className="rounded-2xl h-14 font-black uppercase tracking-widest border-gray-200 text-gray-600 flex items-center justify-center">
                                                        Download Invoice
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Layout (Remains stacked but with bigger fonts) */}
                                    <div className="md:hidden">
                                        {/* Status Header */}
                                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100">
                                                    <Package className="w-4 h-4 text-gray-900" />
                                                </div>
                                                <h3 className="text-body font-black text-gray-900">#{order.id.split('-')[1]}</h3>
                                            </div>
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-widest ${status.color}`}>
                                                {status.icon}
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <div className="flex gap-4 mb-4">
                                                <div className="relative w-20 h-28 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                                                    <Image src={order.products[0].image} alt="" fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 py-1">
                                                    <h4 className="text-body font-bold text-gray-900 mb-1 leading-tight">{order.products[0].name}</h4>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase">Size: {order.products[0].size}</span>
                                                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase">Qty: {order.products[0].quantity}</span>
                                                    </div>
                                                    <p className="text-body font-black text-gray-900">₹{order.products[0].price.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            {order.products.length > 1 && (
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
                                                    <div className="flex -space-x-4">
                                                        {order.products.slice(1, 4).map((p, i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white relative shadow-sm">
                                                                <Image src={p.image} alt="" fill className="object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-400">+{order.products.length - 1} more items</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer Info */}
                                        <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                                                <p className="text-price font-black text-gray-900">₹{order.total.toLocaleString()}</p>
                                            </div>
                                            <Link href={`/account?section=order-details&orderId=${order.id}`}>
                                                <Button size="md" className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-small flex items-center justify-center">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-16 text-center animate-fade-in">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-small font-bold text-gray-600">Our support team is online and ready to help</p>
                    </div>
                    <p className="text-body text-gray-500">
                        Facing issues with an order?{' '}
                        <Link href="/contact" className="text-gray-900 font-black underline underline-offset-4 decoration-gray-200 hover:decoration-gray-900 transition-colors">
                            Contact Customer Happiness
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
