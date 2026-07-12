'use client';

import { useMemo } from 'react';
import { Star, Heart, ShoppingCart, Check, Truck, Shield, RotateCcw, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { StorefrontProductDetail } from '@/types/storefrontProduct';
import { COLOR_HEX } from '@/constants/colorHex';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { formatINR } from '@/lib/shippingUtils';

interface ProductInfoSectionProps {
  product: StorefrontProductDetail;
  selectedSize: string;
  selectedColor: string;
  addedToCart: boolean;
  inWishlist: boolean;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onWishlistToggle: () => void;
}

function resolveColorHex(name: string, variants: StorefrontProductDetail['colorVariants']): string {
  const variant = variants.find((v) => v.name === name);
  if (variant?.hex) return variant.hex;
  return COLOR_HEX[name.toLowerCase().replace(/\s+/g, '-')] || '#9ca3af';
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
}: ProductInfoSectionProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const outOfStock = !product.inStock || product.stockQuantity === 0;
  const lowStock = !outOfStock && product.stockQuantity > 0 && product.stockQuantity <= 5;
  const { settings } = useShippingSettings();

  const shippingLabel = useMemo(() => {
    if (!settings.shippingEnabled) return 'Shipping at checkout';
    if (settings.freeShippingThreshold > 0) {
      return `On orders over ${formatINR(settings.freeShippingThreshold)}`;
    }
    return settings.shippingFee > 0 ? `${formatINR(settings.shippingFee)} shipping fee` : 'Free shipping available';
  }, [settings]);

  return (
    <>
      <div className="space-y-3 md:space-y-6 pb-4 md:pb-0">
        <div>
          {product.brand && (
            <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-amber-800 mb-1">
              {product.brand}
            </p>
          )}
          <div className="flex items-start justify-between mb-2 gap-2">
            <h1 className="text-page-title text-gray-900 flex-1">{product.name}</h1>
            {hasDiscount && (
              <span className="bg-red-100 text-red-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-small font-semibold shrink-0">
                -{discountPercentage}% OFF
              </span>
            )}
          </div>

          {(product.rating ?? 0) > 0 && (
            <div className="flex items-center gap-2 mb-2 md:mb-4">
              <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                <Star className="w-3 h-3 md:w-4 md:h-4 fill-green-600 text-green-600" />
                <span className="text-small font-semibold text-green-700">{product.rating}</span>
              </div>
              {(product.reviews ?? 0) > 0 && (
                <span className="text-small text-gray-600">{product.reviews} Reviews</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
            <span className="text-price text-gray-900">₹{product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-body text-gray-400 line-through">₹{product.originalPrice!.toFixed(2)}</span>
            )}
          </div>

          {outOfStock && (
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
              Out of Stock
            </span>
          )}
          {lowStock && (
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-100">
              Only {product.stockQuantity} left in stock
            </span>
          )}

          <p className="text-body text-gray-600 line-clamp-4 md:line-clamp-none">{product.description}</p>
        </div>

        {product.sizes.length > 0 && (
          <div>
            <label className="block text-small font-semibold text-heading mb-2">
              Select Size {selectedSize && <span className="text-gray-500 font-normal">- {selectedSize}</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeSelect(size)}
                  disabled={outOfStock}
                  className={`px-3 py-1.5 md:px-6 md:py-3 border-2 rounded-lg text-xs md:text-base font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-on-primary shadow-lg'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors.length > 0 && (
          <div>
            <label className="block text-small font-semibold text-heading mb-2">
              Select Color {selectedColor && <span className="text-gray-500 font-normal">- {selectedColor}</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorSelect(color)}
                  disabled={outOfStock}
                  className={`relative px-3 py-1.5 md:px-6 md:py-3 border-2 rounded-lg text-xs md:text-base font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                    selectedColor === color ? 'border-primary shadow-lg' : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: resolveColorHex(color, product.colorVariants) }}
                    />
                    <span className="hidden sm:inline">{color}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="hidden md:block space-y-3">
          <div className="flex gap-3">
            <Button
              onClick={onAddToCart}
              fullWidth
              variant="premium-soft"
              size="xl"
              disabled={outOfStock}
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
            <Button
              onClick={onWishlistToggle}
              variant="premium-outline"
              size="xl"
              iconOnly
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`shrink-0 ${inWishlist ? '[&>span]:bg-heading [&>span]:text-white [&>span]:hover:bg-[#2c1810]' : ''}`}
            >
              <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <Button
            onClick={onBuyNow}
            fullWidth
            variant="premium"
            size="xl"
            disabled={outOfStock}
          >
            <Zap className="w-5 h-5" />
            Buy Now
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-gray-100 rounded-lg">
              <Truck className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="font-semibold text-xs md:text-sm">Free Shipping</p>
              <p className="text-xs text-gray-600">{shippingLabel}</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 md:gap-3 rounded-xl p-3 md:p-0 md:rounded-none ${
              product.isReturnable !== false && (product.returnDays ?? 10) > 0
                ? 'bg-amber-50 border border-amber-200/80 md:bg-transparent md:border-0'
                : ''
            }`}
          >
            <div
              className={`p-2 md:p-3 rounded-lg shrink-0 ${
                product.isReturnable !== false && (product.returnDays ?? 10) > 0
                  ? 'bg-amber-100/80'
                  : 'bg-gray-100'
              }`}
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5 text-amber-800" />
            </div>
            <div>
              <p className="font-semibold text-xs md:text-sm text-amber-950">Easy Returns</p>
              <p className="text-xs text-amber-900/80 font-medium">
                {product.isReturnable !== false && (product.returnDays ?? 10) > 0
                  ? `${product.returnDays ?? 10}-day hassle-free return`
                  : 'Non-returnable item'}
              </p>
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

        <div className="border-t border-gray-200 pt-4 md:pt-6 space-y-3 md:space-y-4">
          <h3 className="text-section-title text-gray-900">Product Details</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="flex justify-between gap-2">
              <span className="text-xs md:text-sm text-gray-600">Category</span>
              <span className="text-xs md:text-sm font-medium capitalize text-right">{product.categoryLabel}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-xs md:text-sm text-gray-600">Gender</span>
              <span className="text-xs md:text-sm font-medium capitalize">{product.gender}</span>
            </div>
            {product.brand && (
              <div className="flex justify-between gap-2">
                <span className="text-xs md:text-sm text-gray-600">Brand</span>
                <span className="text-xs md:text-sm font-medium">{product.brand}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between gap-2">
                <span className="text-xs md:text-sm text-gray-600">Material</span>
                <span className="text-xs md:text-sm font-medium">{product.material}</span>
              </div>
            )}
            {product.season && (
              <div className="flex justify-between gap-2">
                <span className="text-xs md:text-sm text-gray-600">Season</span>
                <span className="text-xs md:text-sm font-medium capitalize">{product.season}</span>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <span className="text-xs md:text-sm text-gray-600">In Stock</span>
              <span className={`text-xs md:text-sm font-medium ${outOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {outOfStock ? '0 units' : `${product.stockQuantity} units`}
              </span>
            </div>
            {(product.soldQuantity ?? 0) > 0 && (
              <div className="flex justify-between gap-2">
                <span className="text-xs md:text-sm text-gray-600">Sold</span>
                <span className="text-xs md:text-sm font-medium text-heading">{product.soldQuantity} units</span>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <span className="text-xs md:text-sm text-gray-600">Availability</span>
              <span className={`text-xs md:text-sm font-medium ${outOfStock ? 'text-red-600' : 'text-green-600'}`}>
                {outOfStock ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>
            <div className="flex justify-between gap-2 col-span-2">
              <span className="text-xs md:text-sm text-gray-600">SKU</span>
              <span className="text-xs md:text-sm font-medium font-mono">{product.slug}</span>
            </div>
          </div>

          {product.specifications.length > 0 && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-sm font-semibold text-heading">Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {product.specifications.map((spec) => (
                  <div key={spec.key} className="flex justify-between gap-3 py-2 border-b border-gray-50">
                    <span className="text-xs md:text-sm text-gray-600">{spec.key}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-900 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-40">
        <div className="flex gap-2 max-w-lg mx-auto">
          <Button
            onClick={onBuyNow}
            variant="premium"
            size="lg"
            disabled={outOfStock}
            className="flex-1"
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>Buy Now</span>
          </Button>
          <button
            onClick={onAddToCart}
            disabled={outOfStock}
            aria-label={addedToCart ? 'Added to cart' : 'Add to cart'}
            className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-heading bg-white text-heading hover:bg-heading hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {addedToCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </>
  );
}
