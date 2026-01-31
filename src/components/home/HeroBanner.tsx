'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const banners = [
    {
        id: 1,
        title: 'THE GENTLEMAN\'S EDIT',
        subtitle: 'Refined Style for Modern Men',
        description: 'Explore our latest collection of premium suits and formals.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop',
        link: '/products?category=bottomwear&item=formal-pants',
        position: 'center',
    },
    {
        id: 2,
        title: 'URBAN STREETWEAR',
        subtitle: 'Bold. Comfortable. You.',
        description: 'Trending oversized tees, cargos, and sneakers.',
        image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2000&auto=format&fit=crop',
        link: '/products?category=topwear&item=t-shirts',
        position: 'center',
    },
    {
        id: 3,
        title: 'ETHNIC ELEGANCE',
        subtitle: 'Tradition Meets Trends',
        description: 'Exquisite Kurtas and Sherwanis for every occasion.',
        image: 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?q=80&w=2000&auto=format&fit=crop',
        link: '/products?category=topwear&item=ethnic-wear',
        position: 'center',
    },
];

export default function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-black">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image */}
                    <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        <div className="container mx-auto px-6">
                            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                                <h2 className="text-white text-lg md:text-xl font-medium tracking-[0.2em] uppercase">
                                    {banner.subtitle}
                                </h2>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                                    {banner.title}
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto hidden md:block">
                                    {banner.description}
                                </p>
                                <div className="pt-4">
                                    <Link href={banner.link}>
                                        <Button
                                            size="lg"
                                            className="bg-white text-black hover:bg-gray-100 border-none px-8 py-4 text-base font-bold uppercase tracking-wider"
                                        >
                                            Shop Collection
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all z-20 hidden md:block"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all z-20 hidden md:block"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 rounded-full h-2 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
