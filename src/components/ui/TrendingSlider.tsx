'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderItem {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    link: string;
    bgColor?: string;
    badge?: string | null;
}

interface TrendingSliderProps {
    items: SliderItem[];
    title: string;
    bgColor?: string;
}

export default function TrendingSlider({ items, title, bgColor = 'bg-gray-50' }: TrendingSliderProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);

    const checkScrollPosition = () => {
        if (!scrollContainerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

        // Show left button if scrolled from the start
        setShowLeftButton(scrollLeft > 10);

        // Show right button if not at the end
        setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        checkScrollPosition();
        window.addEventListener('resize', checkScrollPosition);
        return () => window.removeEventListener('resize', checkScrollPosition);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollAmount = direction === 'left' ? -container.clientWidth * 0.8 : container.clientWidth * 0.8;

        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section className={`py-6 lg:py-16 ${bgColor}`}>
            <div className="container mx-auto px-4 lg:px-4 xl:px-4">
                {/* Section Header */}
                <div className="mb-4 lg:mb-12">
                    <h2 className="text-[10px] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 uppercase tracking-tight">
                        {title}
                    </h2>
                </div>

                {/* Slider Container */}
                <div className="relative group">
                    {/* Left Navigation Button */}
                    {showLeftButton && (
                        <button
                            onClick={() => scroll('left')}
                            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group/btn -translate-x-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                            aria-label="Previous items"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-800 group-hover/btn:text-black transition-colors" />
                        </button>
                    )}

                    {/* Right Navigation Button */}
                    {showRightButton && (
                        <button
                            onClick={() => scroll('right')}
                            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 group/btn translate-x-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                            aria-label="Next items"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-800 group-hover/btn:text-black transition-colors" />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={checkScrollPosition}
                        className="flex overflow-x-auto gap-3 lg:gap-6 scrollbar-hide snap-x snap-mandatory scroll-smooth ps-2 lg:ps-0"
                    >
                        {items.map((item) => (
                            <Link
                                key={item.id}
                                href={item.link}
                                className="shrink-0 w-[calc(35%-6px)] sm:w-[calc(33.333%-8px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-19.2px)] snap-start group/card relative overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Badge */}
                                {item.badge && (
                                    <div className="absolute top-1 left-1 lg:top-3 lg:left-3 bg-red-500 text-white text-[6px] lg:text-xs font-bold px-1.5 py-0.5 rounded z-10">
                                        {item.badge}
                                    </div>
                                )}

                                {/* Image Container - Square on mobile, taller on desktop */}
                                <div className={`relative aspect-square lg:aspect-3/4 overflow-hidden ${item.bgColor || 'bg-gray-100'}`}>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-1.5 lg:p-4 text-white">
                                    <h3 className="text-[8px] lg:text-sm xl:text-base font-bold mb-0.5 lg:mb-1 leading-tight line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-[7px] lg:text-xs text-gray-200 leading-tight mb-0.5 lg:mb-2 line-clamp-2">
                                        {item.subtitle}
                                    </p>
                                    <button className="text-[7px] lg:text-xs font-bold uppercase tracking-wider hover:underline">
                                        + Explore
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
