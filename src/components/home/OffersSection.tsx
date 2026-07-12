'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Tag, TrendingUp, Zap, Gift, ArrowRight,
  Percent, ShoppingBag, Truck, Star, Sparkles, Package,
} from 'lucide-react';
import {
  HomeSection,
  HomeSectionInner,
  IndianSectionHeader,
  FestiveCard,
} from '@/components/home/indian/IndianDecor';
import { OFFER_ACCENTS } from '@/components/home/indian/sectionThemes';

/** Map icon name strings (stored in DB) to lucide components */
const ICON_MAP: Record<string, React.ElementType> = {
  Tag, TrendingUp, Zap, Gift, ArrowRight,
  Percent, ShoppingBag, Truck, Star, Sparkles, Package,
};

interface OfferItem {
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface OffersData {
  badge: string;
  heading: string;
  headingAccent: string;
  subtitle: string;
  offers: OfferItem[];
}

const FALLBACK: OffersData = {
  badge: 'Limited Time',
  heading: 'Special',
  headingAccent: 'Offers',
  subtitle: "Festive deals you don't want to miss.",
  offers: [
    { icon: 'Tag', title: 'Flat 50% Off', description: 'On first purchase', link: '/products?offer=first-purchase' },
    { icon: 'TrendingUp', title: 'Buy 2 Get 1', description: 'On selected items', link: '/products?offer=buy2get1' },
    { icon: 'Zap', title: 'Flash Sale', description: 'Up to 70% off', link: '/products?offer=flash-sale' },
    { icon: 'Gift', title: 'Free Shipping', description: 'Orders above ₹999', link: '/products' },
  ],
};

export default function OffersSection() {
  const [data, setData] = useState<OffersData>(FALLBACK);

  useEffect(() => {
    fetch('/api/cms/special-offers')
      .then((r) => r.json())
      .then((json) => {
        if (json?.status && json?.data) setData(json.data);
      })
      .catch(() => {}); // silently use fallback
  }, []);

  return (
    <HomeSection tone="saffron" pattern="bandhani">
      <HomeSectionInner>
        <IndianSectionHeader
          badge={data.badge}
          title={data.heading}
          titleAccent={data.headingAccent}
          subtitle={data.subtitle}
          align="center"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {data.offers.map((offer, i) => {
            const Icon = ICON_MAP[offer.icon] ?? Tag;
            const accent = OFFER_ACCENTS[i % OFFER_ACCENTS.length];
            return (
              <Link key={i} href={offer.link} className="group block h-full">
                <FestiveCard accent={accent} className="h-full">
                  <div className="flex flex-col items-center text-center p-4 sm:p-5 lg:p-7 h-full">
                    <div className="mb-3 p-3 rounded-full bg-amber-50/80 border border-amber-100 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-amber-900" />
                    </div>
                    <h3 className="text-sm lg:text-base font-bold text-heading mb-1">{offer.title}</h3>
                    <p className="text-[11px] lg:text-sm text-gray-600 mb-3 flex-1">{offer.description}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] lg:text-xs font-semibold text-amber-800 uppercase tracking-wider group-hover:gap-2 transition-all duration-200">
                      Shop Now <ArrowRight className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    </span>
                  </div>
                </FestiveCard>
              </Link>
            );
          })}
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
