'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '@/store';
import Button from '@/components/ui/Button';
import Link from 'next/link';

// Mock orders data
const mockOrders = [
    {
        id: 'ORD-12345678',
        date: '2026-01-08',
        status: 'delivered',
        total: 189.99,
        items: 3,
    },
    {
        id: 'ORD-12345679',
        date: '2026-01-05',
        status: 'shipped',
        total: 129.99,
        items: 2,
    },
    {
        id: 'ORD-12345680',
        date: '2026-01-02',
        status: 'processing',
        total: 249.99,
        items: 4,
    },
];

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'shipped':
                return <Package className="w-5 h-5 text-blue-500" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'text-green-600 bg-green-50';
            case 'shipped':
                return 'text-blue-600 bg-blue-50';
            case 'processing':
                return 'text-yellow-600 bg-yellow-50';
            case 'cancelled':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-[var(--theme-primary)] mb-8">
                My Orders
            </h1>

            {mockOrders.length === 0 ? (
                <div className="text-center py-20">
                    <Package className="w-24 h-24 mx-auto text-[var(--theme-text-muted)] mb-4" />
                    <h2 className="text-2xl font-bold text-[var(--theme-primary)] mb-2">
                        No orders yet
                    </h2>
                    <p className="text-[var(--theme-text-secondary)] mb-6">
                        Start shopping to see your orders here
                    </p>
                    <Link href="/products">
                        <Button size="lg">Start Shopping</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {mockOrders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-[var(--theme-primary)]">
                                            {order.id}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="text-sm text-[var(--theme-text-muted)] space-y-1">
                                        <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
                                        <p>{order.items} items</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm text-[var(--theme-text-muted)] mb-1">
                                            Total
                                        </p>
                                        <p className="text-2xl font-bold text-[var(--theme-primary)]">
                                            ${order.total.toFixed(2)}
                                        </p>
                                    </div>
                                    <Button variant="outline">View Details</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
