'use client';

import { Package, Eye, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function MyOrders() {
    const orders = [
        {
            id: '#12345',
            date: 'Dec 15, 2025',
            status: 'Delivered',
            statusColor: 'green',
            total: '$129.99',
            items: 3,
            image: '/api/placeholder/80/80',
        },
        {
            id: '#12344',
            date: 'Dec 10, 2025',
            status: 'In Transit',
            statusColor: 'blue',
            total: '$89.99',
            items: 2,
            image: '/api/placeholder/80/80',
        },
        {
            id: '#12343',
            date: 'Dec 5, 2025',
            status: 'Processing',
            statusColor: 'yellow',
            total: '$199.99',
            items: 5,
            image: '/api/placeholder/80/80',
        },
        {
            id: '#12342',
            date: 'Nov 28, 2025',
            status: 'Delivered',
            statusColor: 'green',
            total: '$59.99',
            items: 1,
            image: '/api/placeholder/80/80',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-600">Track, return, or buy items again</p>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-gray-900 text-lg">{order.id}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${order.statusColor}-100 text-${order.statusColor}-700`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-1">Ordered on {order.date}</p>
                                    <p className="text-gray-900 font-semibold">{order.total} • {order.items} items</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={`/account?section=order-details&orderId=${order.id}`}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </Link>
                                <Link
                                    href={`/account?section=track-order&orderId=${order.id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                                >
                                    <Truck className="w-4 h-4" />
                                    Track Order
                                </Link>
                                {order.status === 'Delivered' && (
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
                                        <RotateCcw className="w-4 h-4" />
                                        Return
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {orders.length === 0 && (
                <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                    <Link
                        href="/products"
                        className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 font-medium"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}
