'use client';

import {
    Package,
    ChevronRight,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    ShoppingBag
} from 'lucide-react';
import { mockOrders } from '@/data/orders';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function MyOrders() {
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'delivered':
                return {
                    icon: <CheckCircle className="w-3.5 h-3.5" />,
                    color: 'text-green-600 bg-green-50 border-gray-300',
                    label: 'Delivered'
                };
            case 'shipped':
                return {
                    icon: <Package className="w-3.5 h-3.5" />,
                    color: 'text-blue-600 bg-blue-50 border-gray-300',
                    label: 'Shipped'
                };
            case 'processing':
                return {
                    icon: <Clock className="w-3.5 h-3.5" />,
                    color: 'text-yellow-600 bg-yellow-50 border-gray-300',
                    label: 'Processing'
                };
            default:
                return {
                    icon: <Clock className="w-3.5 h-3.5" />,
                    color: 'text-gray-600 bg-gray-50 border-gray-300',
                    label: status.toUpperCase()
                };
        }
    };

    if (mockOrders.length === 0) {
        return (
            <div className="bg-white rounded-md p-16 text-center border border-gray-300">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-gray-200" />
                </div>
                <h2 className="text-section-title font-black text-gray-900 mb-4 uppercase tracking-tight">No orders yet</h2>
                <p className="text-body text-gray-500 mb-10 max-w-sm mx-auto">
                    You haven't placed any orders. Start exploring our premium collection today.
                </p>
                <Link href="/products">
                    <Button size="lg" className="rounded-md px-12 h-14 font-black uppercase tracking-widest bg-black text-white">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h1 className="hidden lg:block text-section-title font-black text-gray-900 mb-8 uppercase tracking-tight">Purchase History</h1>

            <div className="divide-y divide-gray-300 lg:space-y-4 lg:divide-y-0">
                {mockOrders.map((order) => {
                    const status = getStatusInfo(order.status);
                    const firstProduct = order.products[0];

                    return (
                        <div key={order.id} className="group transition-all duration-300 lg:bg-white lg:border lg:border-gray-300 lg:rounded-lg lg:overflow-hidden">
                            <div className="py-5 lg:p-6 flex gap-4 lg:gap-6 items-center">
                                {/* Image */}
                                <div className="relative w-20 h-20 lg:w-24 lg:h-28 rounded-md lg:rounded-md overflow-hidden bg-gray-50 shrink-0 border border-gray-300">
                                    <Image src={firstProduct.image} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] lg:text-[10px] font-black border flex items-center gap-1 uppercase tracking-widest ${status.color}`}>
                                            {status.icon}
                                            {status.label}
                                        </span>
                                        <span className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            #{order.id.split('-')[1]}
                                        </span>
                                    </div>
                                    <h3 className="text-small lg:text-body font-black text-gray-900 mb-1 uppercase tracking-tight truncate">
                                        {firstProduct.name} {order.products.length > 1 && `+ ${order.products.length - 1} more`}
                                    </h3>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </div>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <div className="text-black">₹{order.total.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="hidden lg:block">
                                    <Link href={`/account?section=order-details&orderId=${order.id}`}>
                                        <Button variant="outline" className="rounded-md px-6 h-12 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:bg-black group-hover:text-white border-gray-300 group-hover:border-black transition-all">
                                            View Order
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="lg:hidden">
                                    <Link href={`/account?section=order-details&orderId=${order.id}`}>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-active:bg-black group-active:text-white transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {/* Tap overlay for mobile */}
                            <Link href={`/account?section=order-details&orderId=${order.id}`} className="lg:hidden absolute inset-0 z-0" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
