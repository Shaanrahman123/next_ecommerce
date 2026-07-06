'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { HomeSection, HomeSectionInner } from '@/components/home/indian/IndianDecor';

const banners = [
  {
    href: '/products?sortBy=newest',
    eyebrow: 'Just Dropped',
    title: 'New Arrivals',
    subtitle: 'Discover the latest trends',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1200&q=80',
    cta: 'Shop Now',
    overlay: 'from-amber-950/75 via-amber-900/30',
  },
  {
    href: '/products?featured=true',
    eyebrow: 'Customer Favorites',
    title: 'Best Sellers',
    subtitle: 'Most-loved styles this season',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&q=80',
    cta: 'Explore',
    overlay: 'from-rose-950/75 via-rose-900/30',
  },
];

export default function DripDropBanner() {
  return (
    <HomeSection tone="ivory" pattern="paisley">
      <HomeSectionInner>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {banners.map((banner) => (
            <Link
              key={banner.title}
              href={banner.href}
              className="group relative overflow-hidden rounded-xl border border-amber-200/50 aspect-[21/9] lg:aspect-[16/9] hover:border-amber-300/70 hover:shadow-lg transition-all duration-200"
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-linear-to-t ${banner.overlay} to-transparent`} />
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-300/40 rounded-tl-sm pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8 text-white">
                <p className="text-[10px] lg:text-xs font-medium uppercase tracking-widest text-amber-100/90 mb-1">
                  {banner.eyebrow}
                </p>
                <h3 className="text-lg lg:text-2xl font-bold uppercase tracking-tight mb-1">{banner.title}</h3>
                <p className="text-xs lg:text-sm text-white/80 mb-3 hidden sm:block">{banner.subtitle}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:text-heading transition-all">
                  {banner.cta} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
