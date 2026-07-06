'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { IndianPatternOverlay } from '@/components/home/indian/IndianDecor';
import { CATEGORY_IMAGE_PLACEHOLDER } from '@/utils/categoryImage';
import { useEffect, useState } from 'react';

interface MegaMenuProps {
  menuId: string;
  sections: Array<{
    title: string;
    basePath: string;
    items: Array<{ name: string; slug: string; image: string }>;
  }>;
  featuredImage: string;
  label: string;
  basePath?: string;
  isOpen: boolean;
  onNavItemClick: () => void;
}

function MenuItemImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || CATEGORY_IMAGE_PLACEHOLDER);

  useEffect(() => {
    setImgSrc(src || CATEGORY_IMAGE_PLACEHOLDER);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover group-hover/item:scale-110 transition-transform duration-500"
      sizes="48px"
      onError={() => setImgSrc(CATEGORY_IMAGE_PLACEHOLDER)}
    />
  );
}

function FeaturedImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || CATEGORY_IMAGE_PLACEHOLDER);

  useEffect(() => {
    setImgSrc(src || CATEGORY_IMAGE_PLACEHOLDER);
  }, [src]);

  return (
    <Image
      key={src}
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover group-hover/featured:scale-105 transition-transform duration-700"
      sizes="320px"
      onError={() => setImgSrc(CATEGORY_IMAGE_PLACEHOLDER)}
    />
  );
}

export default function MegaMenu({
  menuId,
  sections,
  featuredImage,
  label,
  basePath,
  isOpen,
  onNavItemClick,
}: MegaMenuProps) {
  if (!isOpen || sections.length === 0) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full z-[110]"
      role="menu"
      aria-label={`${label} menu`}
    >
      {/* Seamless join with navbar — cream overlap upward for hover, no visible gap */}
      <div className="relative bg-[#faf7f2] shadow-2xl shadow-amber-900/10 overflow-hidden -mt-px">
        <div className="absolute -top-2 left-0 right-0 h-2 bg-[#faf7f2]" aria-hidden />
        <IndianPatternOverlay pattern="bandhani" className="text-amber-900" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-500/50 to-transparent pointer-events-none" />

        <div className="relative z-[1] container mx-auto px-6 lg:px-10 xl:px-16 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {sections.map((section) => (
                <div key={`${menuId}-${section.title}`} className="space-y-4">
                  <Link href={section.basePath} onClick={onNavItemClick} className="group/title inline-block">
                    <h3 className="text-sm font-bold text-heading uppercase tracking-widest group-hover/title:text-amber-900 transition-colors">
                      {section.title}
                    </h3>
                    <div className="h-0.5 w-10 mt-2 rounded-full bg-linear-to-r from-amber-500 to-rose-400 scale-x-0 group-hover/title:scale-x-100 origin-left transition-transform duration-300" />
                  </Link>

                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`${section.basePath}&item=${item.slug}`}
                          onClick={onNavItemClick}
                          className="group/item flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-amber-100 transition-all duration-200"
                        >
                          <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-lg bg-stone-100 border border-amber-100/60">
                            <MenuItemImage src={item.image} alt={item.name} />
                          </div>
                          <span className="flex-1 text-sm font-medium text-gray-600 group-hover/item:text-amber-900 transition-colors">
                            {item.name}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 xl:col-span-3">
              <div
                key={`featured-${menuId}-${featuredImage}`}
                className="relative aspect-[4/5] max-h-[340px] lg:max-h-none rounded-2xl overflow-hidden border border-amber-200/60 shadow-lg group/featured"
              >
                <FeaturedImage src={featuredImage} alt={`${label} collection`} />
                <div className="absolute inset-0 bg-linear-to-t from-amber-950/90 via-amber-900/30 to-transparent" />
                <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-amber-400/50 rounded-tl-sm pointer-events-none" />
                <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-amber-400/50 rounded-tr-sm pointer-events-none" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] font-bold uppercase tracking-widest text-amber-100 mb-3">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </span>
                  <h3 className="text-2xl font-bold mb-1 tracking-tight capitalize">{label}</h3>
                  <p className="text-xs text-amber-100/70 mb-4">Curated styles for every occasion</p>
                  <Link
                    href={basePath || `/products?department=${label.toLowerCase()}`}
                    onClick={onNavItemClick}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-50 hover:text-white group/link transition-colors"
                  >
                    Explore All
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
