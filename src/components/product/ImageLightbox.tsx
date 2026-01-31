'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

interface ImageLightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export default function ImageLightbox({ images, currentIndex, onClose, onNavigate }: ImageLightboxProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onNavigate(Math.max(0, currentIndex - 1));
            if (e.key === 'ArrowRight') onNavigate(Math.min(images.length - 1, currentIndex + 1));
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [currentIndex, images.length, onClose, onNavigate]);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 z-10"
                aria-label="Close lightbox"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
                <button
                    onClick={() => onNavigate(currentIndex - 1)}
                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 z-10"
                    aria-label="Previous image"
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {currentIndex < images.length - 1 && (
                <button
                    onClick={() => onNavigate(currentIndex + 1)}
                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 z-10"
                    aria-label="Next image"
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Main Image */}
            <div className="relative w-full max-w-6xl aspect-[4/3] animate-scale-in">
                <Image
                    src={images[currentIndex]}
                    alt={`Product image ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-3 rounded-xl backdrop-blur-sm">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => onNavigate(index)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentIndex
                                ? 'border-white scale-110'
                                : 'border-white/30 hover:border-white/60'
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
