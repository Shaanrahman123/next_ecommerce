'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { useWishlistStore } from '@/store';

export default function WishlistPage() {
    const { items, clearWishlist } = useWishlistStore();

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center space-y-6">
                    <Heart className="w-24 h-24 mx-auto text-[var(--theme-text-muted)]" />
                    <h1 className="text-3xl font-bold text-[var(--theme-primary)]">
                        Your wishlist is empty
                    </h1>
                    <p className="text-[var(--theme-text-secondary)]">
                        Save your favorite items for later
                    </p>
                    <Link href="/products">
                        <Button size="lg">Explore Products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--theme-primary)] mb-2">
                        My Wishlist
                    </h1>
                    <p className="text-[var(--theme-text-secondary)]">
                        {items.length} item{items.length !== 1 ? 's' : ''} saved
                    </p>
                </div>
                <button
                    onClick={clearWishlist}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors duration-300"
                >
                    Clear Wishlist
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((item) => (
                    <ProductCard key={item.productId} product={item.product} />
                ))}
            </div>
        </div>
    );
}
