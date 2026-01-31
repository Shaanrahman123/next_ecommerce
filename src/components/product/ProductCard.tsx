'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useWishlistStore, useCartStore } from '@/store';
import { useState, useEffect } from 'react';

interface ProductCardProps {
    product: Product;
    compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
    const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
    const { addItem: addToCart } = useCartStore();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const inWishlist = isInWishlist(product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    // Auto-slide images on hover
    useEffect(() => {
        if (isHovering && product.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
            }, 800); // Change image every 800ms

            return () => clearInterval(interval);
        } else {
            setCurrentImageIndex(0); // Reset to first image when not hovering
        }
    }, [isHovering, product.images.length]);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            productId: product.id,
            product,
            quantity: 1,
            size: product.sizes[0],
            color: product.colors[0],
        });
    };

    if (compact) {
        return (
            <div
                className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onMouseEnter={() => {
                    setShowQuickAdd(true);
                    setIsHovering(true);
                }}
                onMouseLeave={() => {
                    setShowQuickAdd(false);
                    setIsHovering(false);
                }}
            >
                <Link href={`/products/${product.id}`}>
                    {/* Image Container - Compact */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                        {hasDiscount && (
                            <div className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-0.5 rounded text-xs font-bold">
                                -{discountPercentage}%
                            </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                            onClick={handleWishlistToggle}
                            className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-300 ${inWishlist
                                ? 'bg-black text-white'
                                : 'bg-white/90 text-black hover:bg-black hover:text-white'
                                }`}
                            aria-label="Add to wishlist"
                        >
                            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>

                        {/* Product Image */}
                        <Image
                            src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-300"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        />

                        {/* Quick Add Button */}
                        {showQuickAdd && (
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                <button
                                    onClick={handleQuickAdd}
                                    className="w-full bg-white text-black py-1.5 rounded text-xs font-semibold hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-1"
                                >
                                    <ShoppingCart className="w-3 h-3" />
                                    Add
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Product Info - Compact */}
                    <div className="p-3 space-y-1">
                        <h3 className="text-card-title text-gray-900 line-clamp-1">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        {product.rating && (
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-small font-medium">{product.rating}</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-gray-900">
                                ₹{product.price.toFixed(2)}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs text-gray-500 line-through">
                                    ₹{product.originalPrice!.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        );
    }

    // Regular card (existing design)
    return (
        <div
            className="group relative bg-[var(--theme-secondary)] rounded-lg overflow-hidden border border-[var(--theme-border)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            onMouseEnter={() => {
                setShowQuickAdd(true);
                setIsHovering(true);
            }}
            onMouseLeave={() => {
                setShowQuickAdd(false);
                setIsHovering(false);
            }}
        >
            <Link href={`/products/${product.id}`}>
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {hasDiscount && (
                        <div className="absolute top-4 left-4 z-10 bg-[var(--theme-primary)] text-[var(--theme-secondary)] px-3 py-1 rounded-full text-sm font-semibold">
                            -{discountPercentage}%
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 ${inWishlist
                            ? 'bg-[var(--theme-primary)] text-[var(--theme-secondary)]'
                            : 'bg-white/90 text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white'
                            }`}
                        aria-label="Add to wishlist"
                    >
                        <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>

                    {/* Product Image */}
                    <div className="relative w-full h-full">
                        <div
                            className={`absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'
                                }`}
                        />
                        <Image
                            src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
                            alt={product.name}
                            fill
                            className={`object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={() => setImageLoaded(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>

                    {/* Quick Add Button */}
                    {showQuickAdd && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent animate-slide-in">
                            <button
                                onClick={handleQuickAdd}
                                className="w-full bg-[var(--theme-secondary)] text-[var(--theme-primary)] py-3 rounded-lg font-semibold hover:bg-[var(--theme-primary)] hover:text-[var(--theme-secondary)] transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Quick Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                    <h3 className="text-card-title text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors duration-300">
                        {product.name}
                    </h3>

                    <p className="text-body text-gray-600 line-clamp-2">
                        {product.description}
                    </p>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-small font-medium">{product.rating}</span>
                            {product.reviews && (
                                <span className="text-small text-gray-500">
                                    ({product.reviews})
                                </span>
                            )}
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 pt-2">
                        <span className="text-price text-gray-900">
                            ₹{product.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-small text-gray-400 line-through">
                                ₹{product.originalPrice!.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Available Colors */}
                    <div className="flex gap-2 pt-2">
                        {product.colors.slice(0, 4).map((color) => (
                            <div
                                key={color}
                                className="w-6 h-6 rounded-full border-2 border-[var(--theme-border)]"
                                style={{
                                    backgroundColor: color.toLowerCase(),
                                }}
                                title={color}
                            />
                        ))}
                        {product.colors.length > 4 && (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center text-small">
                                +{product.colors.length - 4}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
