'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SerializedHeroSlide } from '@/lib/cms/heroSerializer';
import { IndianPatternOverlay } from '@/components/home/indian/IndianDecor';

interface HeroBannerCarouselProps {
  slides: SerializedHeroSlide[];
}

export default function HeroBannerCarousel({ slides }: HeroBannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-[50vh] md:h-[75vh] min-h-[320px] md:min-h-[520px] w-full bg-linear-to-br from-[#1a1209] via-heading to-[#2a1810] flex items-center justify-center border-b border-amber-900/20">
        <IndianPatternOverlay pattern="rangoli" className="text-amber-200" />
        <p className="relative text-amber-100/50 text-sm font-medium uppercase tracking-widest">Hero carousel coming soon</p>
      </div>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[50vh] md:h-[75vh] min-h-[320px] md:min-h-[520px] w-full overflow-hidden border-b border-amber-900/15">
      {slides.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            className="object-cover object-top md:object-center"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-amber-950/30 to-amber-900/10" />
          <IndianPatternOverlay pattern="bandhani" className="text-amber-100" />

          <div className="absolute top-4 left-4 w-10 h-10 md:w-14 md:h-14 border-t-2 border-l-2 border-amber-400/40 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-10 h-10 md:w-14 md:h-14 border-t-2 border-r-2 border-amber-400/40 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-10 h-10 md:w-14 md:h-14 border-b-2 border-l-2 border-amber-400/40 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-10 h-10 md:w-14 md:h-14 border-b-2 border-r-2 border-amber-400/40 rounded-br-lg pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center text-center px-6">
            <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 backdrop-blur-sm border border-amber-400/25">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
                  Festive Collection
                </span>
              </div>

              {banner.subtitle && (
                <p className="text-amber-200/80 text-[11px] md:text-sm font-medium tracking-[0.25em] uppercase">
                  {banner.subtitle}
                </p>
              )}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight uppercase drop-shadow-lg">
                {banner.title}
              </h1>
              {banner.description && (
                <p className="text-sm md:text-base text-white/75 max-w-lg mx-auto hidden md:block leading-relaxed">
                  {banner.description}
                </p>
              )}
              <div className="pt-2 md:pt-4">
                <Link href={banner.link}>
                  <button
                    type="button"
                    className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-8 py-3 md:px-10 md:py-3.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-200 rounded-sm shadow-lg shadow-amber-900/30 border border-amber-400/30"
                  >
                    {banner.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-sm border border-amber-300/20 transition-all z-20 hidden md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full backdrop-blur-sm border border-amber-300/20 transition-all z-20 hidden md:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  index === currentSlide
                    ? 'bg-linear-to-r from-amber-400 to-orange-500 w-8'
                    : 'bg-white/40 w-1.5 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
