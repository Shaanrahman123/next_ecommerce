'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { mockProducts } from '@/data/products';
import { useCartStore, useWishlistStore } from '@/store';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfoSection from '@/components/product/ProductInfoSection';
import ProductDescription from '@/components/product/ProductDescription';
import ProductReviews from '@/components/product/ProductReviews';
import SimilarProducts from '@/components/product/SimilarProducts';
import ImageLightbox from '@/components/product/ImageLightbox';
import SizeChartModal from '@/components/product/SizeChartModal';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const product = mockProducts.find((p) => p.id === params.id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [sizeChartOpen, setSizeChartOpen] = useState(false);

    const { addItem: addToCart } = useCartStore();
    const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

    // Sync modal state with URL query parameter
    useEffect(() => {
        const showSizeChart = searchParams.get('sizeChart') === 'true';
        setSizeChartOpen(showSizeChart);
    }, [searchParams]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Product Not Found
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Sorry, we couldn't find the product you're looking for.
                    </p>
                    <Button onClick={() => router.push('/products')}>
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select size and color');
            return;
        }

        addToCart({
            productId: product.id,
            product,
            quantity: 1, // Always add 1 item
            size: selectedSize,
            color: selectedColor,
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
        if (!selectedSize || !selectedColor) {
            alert('Please select size and color');
            return;
        }

        // Add to cart first
        addToCart({
            productId: product.id,
            product,
            quantity: 1, // Always add 1 item
            size: selectedSize,
            color: selectedColor,
        });

        // Navigate to checkout
        router.push('/checkout');
    };

    const handleSizeChartOpen = () => {
        router.push(`/products/${product.id}?sizeChart=true`, { scroll: false });
    };

    const handleSizeChartClose = () => {
        router.back();
    };

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4">
                        <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm overflow-x-auto scrollbar-hide">
                            <button
                                onClick={() => router.push('/')}
                                className="text-gray-600 hover:text-black transition-colors whitespace-nowrap"
                            >
                                Home
                            </button>
                            <span className="text-gray-400">/</span>
                            <button
                                onClick={() => router.push('/products')}
                                className="text-gray-600 hover:text-black transition-colors whitespace-nowrap"
                            >
                                Products
                            </button>
                            <span className="text-gray-400">/</span>
                            <button
                                onClick={() => router.push(`/products?category=${product.category}`)}
                                className="text-gray-600 hover:text-black transition-colors capitalize whitespace-nowrap"
                            >
                                {product.category}
                            </button>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 font-medium truncate">{product.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Main Product Section */}
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12 lg:mb-16">
                        {/* Image Gallery */}
                        <ProductImageGallery
                            images={product.images}
                            productName={product.name}
                            selectedImage={selectedImage}
                            onImageSelect={setSelectedImage}
                            onImageClick={() => setLightboxOpen(true)}
                        />

                        {/* Product Info */}
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
                            onSizeChartClick={handleSizeChartOpen}
                        />
                    </div>

                    {/* Product Description */}
                    <div className="mb-8 md:mb-12 lg:mb-16">
                        <ProductDescription
                            description={product.description}
                            category={product.category}
                        />
                    </div>

                    {/* Product Reviews */}
                    <div className="mb-8 md:mb-12 lg:mb-16">
                        <ProductReviews
                            productId={product.id}
                            averageRating={product.rating || 4.5}
                            totalReviews={product.reviews || 60}
                        />
                    </div>

                    {/* Similar Products */}
                    <SimilarProducts
                        currentProductId={product.id}
                        category={product.category}
                        allProducts={mockProducts}
                    />
                </div>
            </div>

            {/* Image Lightbox */}
            {lightboxOpen && (
                <ImageLightbox
                    images={product.images}
                    currentIndex={selectedImage}
                    onClose={() => setLightboxOpen(false)}
                    onNavigate={setSelectedImage}
                />
            )}

            {/* Size Chart Modal */}
            <SizeChartModal
                isOpen={sizeChartOpen}
                onClose={handleSizeChartClose}
            />
        </>
    );
}
