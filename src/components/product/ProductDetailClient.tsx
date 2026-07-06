'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore, useWishlistStore } from '@/store';
import { StorefrontProductDetail } from '@/types/storefrontProduct';
import { Product } from '@/types';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfoSection from '@/components/product/ProductInfoSection';
import ProductDescription from '@/components/product/ProductDescription';
import ProductCustomerReviews from '@/components/product/ProductCustomerReviews';
import SimilarProducts from '@/components/product/SimilarProducts';
import ImageLightbox from '@/components/product/ImageLightbox';
import AlertModal from '@/components/ui/AlertModal';

interface ProductDetailClientProps {
  product: StorefrontProductDetail;
  similarProducts: Product[];
}

export default function ProductDetailClient({ product, similarProducts }: ProductDetailClientProps) {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string } | null>(null);

  const { addItem: addToCart } = useCartStore();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  const showSelectionAlert = () => {
    const missing: string[] = [];
    if (product.sizes.length && !selectedSize) missing.push('size');
    if (product.colors.length && !selectedColor) missing.push('color');

    setAlertModal({
      title: 'Selection Required',
      message:
        missing.length === 2
          ? 'Please select a size and color before continuing.'
          : missing[0] === 'size'
            ? 'Please select a size before continuing.'
            : 'Please select a color before continuing.',
    });
  };

  const validateSelection = () => {
    const needsSize = product.sizes.length > 0 && !selectedSize;
    const needsColor = product.colors.length > 0 && !selectedColor;
    if (needsSize || needsColor) {
      showSelectionAlert();
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;

    addToCart({
      productId: product.id,
      product,
      quantity: 1,
      size: selectedSize || 'One Size',
      color: selectedColor || 'Default',
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    addToCart({
      productId: product.id,
      product,
      quantity: 1,
      size: selectedSize || 'One Size',
      color: selectedColor || 'Default',
    });

    router.push('/checkout');
  };

  return (
    <>
      <div className="bg-white min-h-screen pb-12 lg:pb-0">
        <div className="bg-white border-b border-amber-900/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm overflow-x-auto scrollbar-hide">
              {product.breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5 md:gap-2 shrink-0">
                  {i > 0 && <span className="text-gray-400">/</span>}
                  {i === product.breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 font-medium truncate max-w-[160px] md:max-w-xs">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-600 hover:text-amber-900 transition-colors whitespace-nowrap"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12 lg:mb-16">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              onImageClick={() => setLightboxOpen(true)}
            />

            <ProductInfoSection
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              addedToCart={addedToCart}
              inWishlist={inWishlist}
              onSizeSelect={setSelectedSize}
              onColorSelect={setSelectedColor}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onWishlistToggle={handleWishlistToggle}
            />
          </div>

          <div className="mb-8 md:mb-12 lg:mb-16">
            <ProductDescription
              description={product.description}
              category={product.categoryLabel}
              specifications={product.specifications}
              material={product.material}
              season={product.season}
              brand={product.brand}
            />
          </div>

          <div className="mb-8 md:mb-12 lg:mb-16">
            <ProductCustomerReviews
              productId={product.id}
              averageRating={product.rating}
              totalReviews={product.reviews}
            />
          </div>

          <SimilarProducts currentProductId={product.id} products={similarProducts} />
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={product.images}
          currentIndex={selectedImage}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setSelectedImage}
        />
      )}

      <AlertModal
        isOpen={!!alertModal}
        title={alertModal?.title || ''}
        message={alertModal?.message || ''}
        variant="warning"
        onClose={() => setAlertModal(null)}
      />
    </>
  );
}
