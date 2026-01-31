'use client';

import Link from 'next/link';
import { CheckCircle, Package, Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function OrderSuccessPage() {
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping" />
                        <CheckCircle className="w-24 h-24 text-green-500 relative" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--theme-primary)]">
                        Order Confirmed!
                    </h1>
                    <p className="text-xl text-[var(--theme-text-secondary)]">
                        Thank you for your purchase
                    </p>
                </div>

                {/* Order Details */}
                <div className="bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-lg p-8 space-y-6">
                    <div className="flex items-center justify-center gap-3 text-lg">
                        <Package className="w-6 h-6 text-[var(--theme-primary)]" />
                        <span className="text-[var(--theme-text-secondary)]">Order Number:</span>
                        <span className="font-bold text-[var(--theme-primary)]">{orderNumber}</span>
                    </div>

                    <div className="border-t border-[var(--theme-border)] pt-6 space-y-3 text-[var(--theme-text-secondary)]">
                        <p>
                            We&apos;ve sent a confirmation email with your order details.
                        </p>
                        <p>
                            Your order will be processed and shipped within 2-3 business days.
                        </p>
                        <p>
                            You can track your order status in your account.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/orders">
                        <Button size="lg">
                            View Order Details
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button size="lg" variant="outline" className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Additional Info */}
                <div className="pt-8 border-t border-[var(--theme-border)]">
                    <p className="text-sm text-[var(--theme-text-muted)]">
                        Need help? Contact our{' '}
                        <Link
                            href="/contact"
                            className="text-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors duration-300"
                        >
                            customer support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
