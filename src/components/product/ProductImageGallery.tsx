'use client';

import Image from 'next/image';
import { useRef } from 'react';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
    selectedImage: number;
    onImageSelect: (index: number) => void;
    onImageClick: () => void;
}

export default function ProductImageGallery({
    images,
    productName,
    selectedImage,
    onImageSelect,
    onImageClick,
}: ProductImageGalleryProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="space-y-3 md:space-y-4">
            {/* Grid Layout - Desktop (lg and above) */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-3 md:gap-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in group"
                        onClick={() => {
                            onImageSelect(index);
                            onImageClick();
                        }}
                    >
                        <Image
                            src={image}
                            alt={`${productName} ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority={index < 2}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                                <span className="text-xs md:text-sm font-medium">Click to enlarge</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Image - Medium devices (md to lg) */}
            <div
                className="hidden md:block lg:hidden relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group"
                onClick={onImageClick}
            >
                <Image
                    src={images[selectedImage] || '/placeholder-product.jpg'}
                    alt={productName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                        <span className="text-xs md:text-sm font-medium">Click to enlarge</span>
                    </div>
                </div>
            </div>

            {/* Horizontal Scroll Gallery - Mobile */}
            <div className="md:hidden">
                <div
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="shrink-0 w-[85vw] snap-center"
                            onClick={() => {
                                onImageSelect(index);
                                onImageClick();
                            }}
                        >
                            <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src={image}
                                    alt={`${productName} ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Thumbnail Images - Medium devices only (md to lg) */}
            {images.length > 1 && (
                <div className="hidden md:grid lg:hidden grid-cols-4 gap-3 md:gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => onImageSelect(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                                ? 'border-black shadow-lg scale-105'
                                : 'border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${productName} ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
