'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CategoryGridItem } from '@/lib/cms/getCategoryGrid';
import { CATEGORY_IMAGE_PLACEHOLDER } from '@/utils/categoryImage';
import {
  HomeSection,
  HomeSectionInner,
  IndianSectionHeader,
} from '@/components/home/indian/IndianDecor';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface CategoryGridViewProps {
  items: CategoryGridItem[];
}

const CARD_STYLES = [
  { overlay: 'from-amber-950/75 via-amber-900/25', border: 'border-amber-200/70 hover:border-amber-400' },
  { overlay: 'from-rose-950/75 via-rose-900/25', border: 'border-rose-200/70 hover:border-rose-400' },
  { overlay: 'from-orange-950/75 via-orange-900/25', border: 'border-orange-200/70 hover:border-orange-400' },
  { overlay: 'from-red-950/75 via-red-900/25', border: 'border-red-200/60 hover:border-red-400' },
] as const;

function CategoryGridImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 25vw"
      onError={() => setImgSrc(CATEGORY_IMAGE_PLACEHOLDER)}
    />
  );
}

export default function CategoryGridView({ items }: CategoryGridViewProps) {
  if (items.length === 0) return null;

  return (
    <HomeSection tone="cream" pattern="rangoli">
      <HomeSectionInner>
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10 lg:mb-12">
            <IndianSectionHeader
              badge="Curated For You"
              title="Categories"
              titleAccent="To Bag"
              subtitle="Handpicked styles — from everyday essentials to festive favourites."
            />
            <Link
              href="/products"
              className="hidden lg:inline-flex items-center gap-2 px-6 py-3 rounded-full border border-amber-300/70 bg-white/90 text-sm font-semibold text-heading hover:border-amber-500 hover:bg-amber-50 hover:text-amber-900 transition-all group shrink-0 shadow-sm"
            >
              Explore All
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {items.map((category, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
            <ScrollReveal key={category.id} delay={i * 0.1}>
              <Link href={category.link} className="group block h-full">
                <article
                  className={`relative h-full rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${style.border}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <CategoryGridImage src={category.imageUrl} alt={category.title} />
                    <div
                      className={`absolute inset-0 bg-linear-to-t ${style.overlay} to-transparent`}
                    />
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400/50 rounded-tl-md pointer-events-none" />
                    {category.departmentLabel && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-amber-900 border border-amber-200/60">
                        {category.departmentLabel}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                      <h3 className="text-xl lg:text-2xl font-bold text-white uppercase tracking-tight drop-shadow-md">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 lg:p-6 space-y-3">
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{category.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 group-hover:gap-2.5 transition-all">
                      Shop Now <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            </ScrollReveal>
            );
          })}
        </div>

        <div className="lg:hidden text-center mt-8">
          <Link
            href="/products"
            className="text-sm font-semibold text-amber-800 inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-amber-200 bg-white/90 shadow-sm"
          >
            Explore All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
