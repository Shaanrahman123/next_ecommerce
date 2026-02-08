'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Home, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store';

export default function OrderSuccessPage() {
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    const { clearCart } = useCartStore();

    // Ensure cart is cleared if it wasn't already
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 md:py-8">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-xl w-full relative z-10">
                {/* Success Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="p-4 md:p-12">
                        {/* Success Icon Section */}
                        <div className="flex flex-col items-center text-center mb-12">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-green-100 rounded-full scale-125 animate-pulse opacity-60" />
                                <div className="absolute inset-0 bg-green-50 rounded-full scale-110" />
                                <div className="relative bg-white rounded-full p-1">
                                    <CheckCircle className="w-14 h-14 text-green-500" strokeWidth={1.5} />
                                </div>
                            </div>

                            <h1 className="text-page-title text-gray-900 mb-2">
                                Order Confirmed!
                            </h1>
                            <p className="text-body text-gray-500 font-medium">
                                Thank you for your purchase. Your order has been received and is being processed.
                            </p>
                        </div>

                        {/* Order Info Card */}
                        <div className="bg-gray-50 rounded-3xl p-6 md:p-8 space-y-6 mb-10">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                                        <Package className="w-5 h-5 text-gray-900" />
                                    </div>
                                    <span className="text-small font-bold text-gray-400 uppercase tracking-wider">Order Number</span>
                                </div>
                                <span className="text-body font-black text-gray-900">
                                    {orderNumber}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                    <p className="text-small text-gray-600 leading-relaxed">
                                        A confirmation email has been sent to your registered email address.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <p className="text-small text-gray-600 leading-relaxed">
                                        Estimated delivery within <span className="font-bold text-gray-900">3-5 business days</span>.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                                    <p className="text-small text-gray-600 leading-relaxed">
                                        You can track your order status in the <Link href="/account" className="font-bold text-gray-900 underline underline-offset-4 decoration-gray-200 hover:decoration-gray-900 transition-colors">My Account</Link> section.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <Link href={`/account?section=order-details&orderId=${orderNumber}`} className="w-full">
                                <Button
                                    fullWidth
                                    size="md"
                                    className="rounded-xl h-12 text-[10px] md:text-small font-black uppercase tracking-widest shadow-lg shadow-black/5 flex items-center justify-center"
                                >
                                    Track Order
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Button>
                            </Link>
                            <Link href="/" className="w-full">
                                <Button
                                    fullWidth
                                    variant="outline"
                                    size="md"
                                    className="rounded-xl h-12 text-[10px] md:text-small font-bold text-gray-600 hover:text-gray-900 border-gray-200 uppercase tracking-widest flex items-center justify-center"
                                >
                                    <ShoppingBag className="w-4 h-4 mr-1.5" />
                                    Shop More
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-gray-50/50 p-6 text-center border-t border-gray-100">
                        <p className="text-small text-gray-400">
                            Need help with your order?{' '}
                            <Link href="/contact" className="text-gray-900 font-bold hover:underline">
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
