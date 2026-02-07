'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const total = getTotal();
    const shipping = total > 100 ? 0 : 10;
    const tax = total * 0.1;
    const grandTotal = total + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center space-y-6">
                    <ShoppingBag className="w-24 h-24 mx-auto text-[var(--theme-text-muted)]" />
                    <h1 className="text-page-title font-bold text-[var(--theme-primary)]">
                        Your cart is empty
                    </h1>
                    <p className="text-[var(--theme-text-secondary)]">
                        Add some products to get started
                    </p>
                    <Link href="/products">
                        <Button size="lg">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-page-title text-[var(--theme-primary)] mb-8">
                Shopping Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div
                            key={`${item.productId}-${item.size}-${item.color}`}
                            className="flex gap-4 p-4 bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-lg hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Product Image */}
                            <Link
                                href={`/products/${item.productId}`}
                                className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden"
                            >
                                <Image
                                    src={item.product.images[0] || '/placeholder-product.jpg'}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                />
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.productId}`}>
                                    <h3 className="text-card-title font-semibold text-[var(--theme-text-primary)] hover:text-[var(--theme-text-secondary)] transition-colors duration-300 truncate">
                                        {item.product.name}
                                    </h3>
                                </Link>
                                <p className="text-body text-[var(--theme-text-muted)] mt-1">
                                    Size: {item.size} | Color: {item.color}
                                </p>
                                <p className="text-price text-[var(--theme-primary)] mt-2">
                                    ₹{item.product.price.toFixed(2)}
                                </p>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 mt-3">
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.productId,
                                                item.size,
                                                item.color,
                                                Math.max(1, item.quantity - 1)
                                            )
                                        }
                                        className="p-1 border border-[var(--theme-border)] rounded hover:bg-[var(--theme-hover)] transition-colors duration-300"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.productId,
                                                item.size,
                                                item.color,
                                                item.quantity + 1
                                            )
                                        }
                                        className="p-1 border border-[var(--theme-border)] rounded hover:bg-[var(--theme-hover)] transition-colors duration-300"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeItem(item.productId, item.size, item.color)}
                                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                aria-label="Remove item"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}

                    {/* Clear Cart */}
                    <button
                        onClick={clearCart}
                        className="text-body text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                        Clear Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--theme-secondary)] border border-[var(--theme-border)] rounded-lg p-6 sticky top-24">
                        <h2 className="text-section-title font-bold text-[var(--theme-primary)] mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-body">
                                <span className="text-[var(--theme-text-secondary)]">Subtotal</span>
                                <span className="font-medium">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-body">
                                <span className="text-[var(--theme-text-secondary)]">Shipping</span>
                                <span className="font-medium">
                                    {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            {total > 0 && total < 100 && (
                                <p className="text-body text-green-600">
                                    Add ₹{(100 - total).toFixed(2)} more for free shipping!
                                </p>
                            )}
                            <div className="flex justify-between text-body">
                                <span className="text-[var(--theme-text-secondary)]">Tax (10%)</span>
                                <span className="font-medium">₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-[var(--theme-border)] pt-4">
                                <div className="flex justify-between text-price font-bold">
                                    <span>Total</span>
                                    <span className="text-[var(--theme-primary)]">
                                        ₹{grandTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            fullWidth
                            size="lg"
                            onClick={() => router.push('/checkout')}
                        >
                            Proceed to Checkout
                        </Button>

                        <Link href="/products">
                            <Button fullWidth size="lg" variant="outline" className="mt-4">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
