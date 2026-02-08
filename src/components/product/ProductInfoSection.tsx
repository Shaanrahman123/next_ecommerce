'use client';

import { Star, Heart, ShoppingCart, Check, Truck, Shield, RotateCcw, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Product } from '@/types';

interface ProductInfoSectionProps {
    product: Product;
    selectedSize: string;
    selectedColor: string;
    addedToCart: boolean;
    inWishlist: boolean;
    onSizeSelect: (size: string) => void;
    onColorSelect: (color: string) => void;
    onAddToCart: () => void;
    onBuyNow: () => void;
    onWishlistToggle: () => void;
    onSizeChartClick?: () => void;
}

export default function ProductInfoSection({
    product,
    selectedSize,
    selectedColor,
    addedToCart,
    inWishlist,
    onSizeSelect,
    onColorSelect,
    onAddToCart,
    onBuyNow,
    onWishlistToggle,
    onSizeChartClick,
}: ProductInfoSectionProps) {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    return (
        <>
            <div className="space-y-3 md:space-y-6 pb-4 md:pb-0">
                {/* Header */}
                <div>
                    <div className="flex items-start justify-between mb-2 gap-2">
                        <h1 className="text-page-title text-gray-900 flex-1">
                            {product.name}
                        </h1>
                        {hasDiscount && (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-small font-semibold shrink-0">
                                -{discountPercentage}% OFF
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-2 mb-2 md:mb-4">
                            <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                                <Star className="w-3 h-3 md:w-4 md:h-4 fill-green-600 text-green-600" />
                                <span className="text-small font-semibold text-green-700">{product.rating}</span>
                            </div>
                            {product.reviews && (
                                <span className="text-small text-gray-600">
                                    {product.reviews} Reviews
                                </span>
                            )}
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-6">
                        <span className="text-price text-gray-900">
                            ₹{product.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-body text-gray-400 line-through">
                                ₹{product.originalPrice!.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <p className="text-body text-gray-600">
                        {product.description}
                    </p>
                </div>

                {/* Size Selection */}
                <div>
                    <label className="block text-small font-semibold text-gray-900 mb-2">
                        Select Size {selectedSize && <span className="text-gray-500 font-normal">- {selectedSize}</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => onSizeSelect(size)}
                                className={`px-3 py-1.5 md:px-6 md:py-3 border-2 rounded-lg text-xs md:text-base font-medium transition-all duration-300 ${selectedSize === size
                                    ? 'border-black bg-black text-white shadow-lg'
                                    : 'border-gray-300 hover:border-black'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {onSizeChartClick && (
                        <button
                            onClick={onSizeChartClick}
                            className="mt-2 text-xs md:text-sm text-black underline hover:no-underline transition-all duration-200 font-medium"
                        >
                            SIZE CHART
                        </button>
                    )}
                </div>

                {/* Color Selection */}
                <div>
                    <label className="block text-small font-semibold text-gray-900 mb-2">
                        Select Color {selectedColor && <span className="text-gray-500 font-normal">- {selectedColor}</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => onColorSelect(color)}
                                className={`relative px-3 py-1.5 md:px-6 md:py-3 border-2 rounded-lg text-xs md:text-base font-medium transition-all duration-300 ${selectedColor === color
                                    ? 'border-black shadow-lg'
                                    : 'border-gray-300 hover:border-black'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-gray-300"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                    <span className="hidden sm:inline">{color}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>


                {/* Actions - Hidden on mobile, shown on larger screens */}
                <div className="hidden md:block space-y-3">
                    {/* Primary Actions */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onAddToCart}
                            fullWidth
                            variant="secondary"
                            className="flex items-center justify-center gap-2 py-4 text-base"
                        >
                            {addedToCart ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Added to Cart</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </Button>
                        <button
                            onClick={onWishlistToggle}
                            className={`p-4 border-2 rounded-lg transition-all duration-300 shrink-0 ${inWishlist
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-black'
                                }`}
                        >
                            <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                    {/* Buy Now Button */}
                    <Button
                        onClick={onBuyNow}
                        fullWidth
                        className="flex items-center justify-center gap-2 py-4 text-base bg-linear-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black"
                    >
                        <Zap className="w-5 h-5" />
                        Buy Now
                    </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-2 md:p-3 bg-gray-100 rounded-lg">
                            <Truck className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-xs md:text-sm">Free Shipping</p>
                            <p className="text-xs text-gray-600">On orders over ₹50</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-2 md:p-3 bg-gray-100 rounded-lg">
                            <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-xs md:text-sm">Easy Returns</p>
                            <p className="text-xs text-gray-600">30-day return policy</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-2 md:p-3 bg-gray-100 rounded-lg">
                            <Shield className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-xs md:text-sm">Secure Payment</p>
                            <p className="text-xs text-gray-600">100% secure checkout</p>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="border-t border-gray-200 pt-4 md:pt-6 space-y-3 md:space-y-4">
                    <h3 className="text-section-title text-gray-900">Product Details</h3>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="flex justify-between">
                            <span className="text-xs md:text-sm text-gray-600">Category</span>
                            <span className="text-xs md:text-sm font-medium capitalize">{product.category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs md:text-sm text-gray-600">Gender</span>
                            <span className="text-xs md:text-sm font-medium capitalize">{product.gender}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs md:text-sm text-gray-600">Availability</span>
                            <span className={`text-xs md:text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs md:text-sm text-gray-600">SKU</span>
                            <span className="text-xs md:text-sm font-medium">{product.id.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar - Mobile Only */}
            <div className="md:hidden fixed bottom-0 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-40">
                <div className="flex gap-2">
                    {/* Buy Now Button - 80% */}
                    <Button
                        onClick={onBuyNow}
                        className="flex-[0.8] flex items-center justify-center gap-1.5 py-3 text-sm font-semibold bg-black hover:bg-gray-800"
                    >
                        <Zap className="w-4 h-4" />
                        Buy Now
                    </Button>
                    {/* Add to Cart Button - 20% */}
                    <Button
                        onClick={onAddToCart}
                        variant="secondary"
                        className="flex-[0.2] flex items-center justify-center py-3"
                    >
                        {addedToCart ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <ShoppingCart className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}
