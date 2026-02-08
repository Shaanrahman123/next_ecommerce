'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ChevronRight, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const total = getTotal();
    const shipping = total > 1000 ? 0 : 100;
    const grandTotal = total + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50">
                <div className="text-center max-w-md w-full animate-fade-in">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-300 flex items-center justify-center mx-auto mb-6 shadow-none group">
                        <ShoppingBag className="w-8 h-8 text-gray-200 group-hover:text-black transition-colors duration-500" />
                    </div>
                    <h1 className="text-page-title text-gray-900 mb-2 uppercase tracking-tight">
                        Your cart is empty
                    </h1>
                    <p className="text-small text-gray-500 mb-8 uppercase tracking-widest font-bold">
                        Add some premium pieces to your collection.
                    </p>
                    <Link href="/products">
                        <Button className="w-full h-12 bg-black text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 lg:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-0.5 bg-black rounded-full" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Your Selection</span>
                        </div>
                        <h1 className="text-section-title font-black text-gray-900 uppercase tracking-tight">
                            Shopping Cart
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                            {items.length} item{items.length !== 1 ? 's' : ''} ready for checkout
                        </p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-[9px] font-black text-red-600 hover:text-red-700 uppercase tracking-widest border-b border-red-600/20 pb-0.5 w-fit"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-none animate-fade-in">
                            <div className="divide-y divide-gray-300">
                                {items.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.size}-${item.color}`}
                                        className="p-4 lg:p-6 flex gap-4 lg:gap-8 group hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-24 lg:w-32 aspect-4/5 bg-gray-100 rounded-md overflow-hidden border border-gray-300 shrink-0">
                                            <Link href={`/products/${item.productId}`}>
                                                <Image
                                                    src={item.product.images[0] || '/placeholder-product.jpg'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </Link>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                                            <div className="relative">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        {item.size} / {item.color}
                                                    </span>
                                                    <button
                                                        onClick={() => removeItem(item.productId, item.size, item.color)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors duration-300"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <Link href={`/products/${item.productId}`}>
                                                    <h3 className="text-body font-black text-gray-900 uppercase tracking-tight mb-2 truncate group-hover:text-black">
                                                        {item.product.name}
                                                    </h3>
                                                </Link>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-body font-black text-gray-900">₹{item.product.price.toLocaleString()}</span>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-md p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors text-gray-500 hover:text-black"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="text-[11px] font-black w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors text-gray-500 hover:text-black"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-start">
                            <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors group">
                                <ArrowRight className="w-3 h-3 rotate-180 transition-transform group-hover:-translate-x-1" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 pb-32 lg:pb-0">
                        <div className="bg-white border border-gray-300 rounded-lg p-6 lg:p-8 sticky top-24 shadow-none">
                            <h2 className="text-body font-black text-gray-900 uppercase tracking-widest border-l-4 border-black pl-3 mb-8">
                                Summary
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-small font-black uppercase tracking-tight text-gray-900">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                                        {shipping === 0 ? 'Complimentary' : `₹${shipping.toLocaleString()}`}
                                    </span>
                                </div>
                                {total < 1000 && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                            Add ₹{(1000 - total).toLocaleString()} more for <span className="text-black underline underline-offset-4">free shipping</span>
                                        </p>
                                    </div>
                                )}
                                <div className="pt-6 border-t border-gray-100 mt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</span>
                                        <span className="text-2xl font-black uppercase tracking-tight text-gray-900 leading-none">₹{grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                fullWidth
                                className="hidden lg:flex h-16 bg-black text-white rounded-md font-black uppercase tracking-[0.15em] text-[10px] hover:bg-gray-900 transition-all items-center justify-center gap-2 shadow-none border-none whitespace-nowrap group"
                                onClick={() => router.push('/checkout')}
                            >
                                Proceed to Checkout
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <div className="mt-8 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Secure encrypted checkout</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Estimated delivery: 3-5 days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Mobile Checkout Bar - Positioned above MobileBottomNav (4rem) */}
            <div className="lg:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] left-0 right-0 bg-white border-t border-gray-300 p-4 z-40 animate-slide-up shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight">Total Amount</span>
                        <span className="text-xl font-black text-gray-900 uppercase tracking-tight">₹{grandTotal.toLocaleString()}</span>
                    </div>
                    <Button
                        className="flex-1 h-14 bg-black text-white rounded-md font-black uppercase tracking-[0.1em] text-[10px] flex items-center justify-center gap-2 shadow-none border-none whitespace-nowrap group"
                        onClick={() => router.push('/checkout')}
                    >
                        Checkout
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
