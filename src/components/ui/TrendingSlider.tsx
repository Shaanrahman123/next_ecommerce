'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  HomeSection,
  HomeSectionInner,
  IndianSectionHeader,
  FestiveCard,
} from '@/components/home/indian/IndianDecor';
import { SectionTheme } from '@/components/home/indian/sectionThemes';

interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  badge?: string | null;
}

interface TrendingSliderProps {
  items: SliderItem[];
  theme: SectionTheme;
}

export default function TrendingSlider({ items, theme }: TrendingSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftButton(scrollLeft > 10);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [items.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -container.clientWidth * 0.75 : container.clientWidth * 0.75;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <HomeSection tone={theme.tone} pattern={theme.pattern}>
      <HomeSectionInner>
        <IndianSectionHeader
          badge={theme.badge}
          title={theme.titleMain}
          titleAccent={theme.titleAccent}
          subtitle={theme.subtitle}
        />

        <div className="relative group">
          {showLeftButton && (
            <button
              onClick={() => scroll('left')}
              className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white/90 rounded-full shadow-md border border-amber-200/60 hover:border-amber-400 transition-all"
              aria-label="Previous items"
            >
              <ChevronLeft className="w-5 h-5 text-amber-900" />
            </button>
          )}
          {showRightButton && (
            <button
              onClick={() => scroll('right')}
              className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white/90 rounded-full shadow-md border border-amber-200/60 hover:border-amber-400 transition-all"
              aria-label="Next items"
            >
              <ChevronRight className="w-5 h-5 text-amber-900" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory scroll-smooth pb-1"
          >
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="shrink-0 w-[42vw] sm:w-[30vw] md:w-[22vw] lg:w-[17vw] xl:w-[15vw] snap-start group/card"
              >
                <FestiveCard accent={theme.cardAccent} className="overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                      sizes="(max-width:768px) 42vw, 17vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-amber-950/25 via-transparent to-transparent" />
                    {item.badge && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-linear-to-r from-amber-600 to-orange-600 text-white shadow-sm">
                        {item.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-amber-100/50">
                    <h3 className="text-xs lg:text-sm font-semibold text-heading leading-tight truncate">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-[10px] lg:text-xs text-gray-500 mt-1 line-clamp-1">{item.subtitle}</p>
                    )}
                  </div>
                </FestiveCard>
              </Link>
            ))}
          </div>
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
