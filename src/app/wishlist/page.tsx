'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ChevronRight, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useWishlistStore, useCartStore } from '@/store';

export default function WishlistPage() {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const { addItem } = useCartStore();

    const handleMoveToCart = (product: any) => {
        addItem({
            productId: product.id,
            product: product,
            quantity: 1,
            size: product.sizes[0] || 'M',
            color: product.colors[0] || 'Black',
        });
        removeItem(product.id);
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gray-50">
                <div className="text-center max-w-md w-full animate-fade-in">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-300 flex items-center justify-center mx-auto mb-6 shadow-none group">
                        <Heart className="w-8 h-8 text-gray-200 group-hover:text-black transition-colors duration-500" />
                    </div>
                    <h1 className="text-page-title text-gray-900 mb-2 uppercase tracking-tight">
                        Wishlist is empty
                    </h1>
                    <p className="text-small text-gray-500 mb-8 uppercase tracking-widest font-bold">
                        Looks like you haven't added any premium pieces yet.
                    </p>
                    <Link href="/products">
                        <Button className="w-full h-12 bg-black text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 transition-all">
                            Explore Collection
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 lg:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-0.5 bg-black rounded-full" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Curated Collection</span>
                        </div>
                        <h1 className="text-section-title font-black text-gray-900 uppercase tracking-tight">
                            My Wishlist
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                            {items.length} item{items.length !== 1 ? 's' : ''} saved to your vault
                        </p>
                    </div>
                    <button
                        onClick={clearWishlist}
                        className="text-[9px] font-black text-red-600 hover:text-red-700 uppercase tracking-widest border-b border-red-600/20 pb-0.5 w-fit"
                    >
                        Clear All
                    </button>
                </div>

                {/* List Container */}
                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-none animate-fade-in">
                    <div className="divide-y divide-gray-300">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="p-4 lg:p-6 flex gap-4 lg:gap-8 group hover:bg-gray-50/50 transition-colors"
                            >
                                {/* Image Container */}
                                <div className="relative w-24 lg:w-32 aspect-4/5 bg-gray-100 rounded-md overflow-hidden border border-gray-300 shrink-0">
                                    <Link href={`/products/${item.productId}`}>
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </Link>
                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-md flex items-center justify-center text-red-600 hover:bg-white hover:scale-110 transition-all duration-300 shadow-none border border-gray-300"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                                    <div className="relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.product.category}</span>
                                        </div>
                                        <Link href={`/products/${item.productId}`}>
                                            <h3 className="text-body font-black text-gray-900 uppercase tracking-tight mb-2 truncate group-hover:text-black">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight line-clamp-1 mb-4 hidden sm:block">
                                            {item.product.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between sm:justify-start sm:gap-6">
                                            <span className="text-body font-black text-gray-900">₹{item.product.price.toLocaleString()}</span>
                                            <Button
                                                onClick={() => handleMoveToCart(item.product)}
                                                className="hidden sm:flex h-10 px-6 bg-black text-white rounded-md font-black uppercase tracking-widest text-[9px] items-center justify-center gap-2 hover:bg-gray-900 transition-all shrink-0 shadow-none border-none"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                                Add to Cart
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={() => handleMoveToCart(item.product)}
                                            className="sm:hidden w-full h-10 bg-black text-white rounded-md font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-none border-none"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-10 text-center">
                    <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors group">
                        Continue Shopping
                        <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
