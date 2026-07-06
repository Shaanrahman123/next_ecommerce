'use client';

import Link from 'next/link';
import { Tag, TrendingUp, Zap, Gift } from 'lucide-react';
import {
  HomeSection,
  HomeSectionInner,
  IndianSectionHeader,
  FestiveCard,
} from '@/components/home/indian/IndianDecor';
import { OFFER_ACCENTS } from '@/components/home/indian/sectionThemes';

const offers = [
  { id: 1, icon: Tag, title: 'Flat 50% Off', description: 'On first purchase', link: '/products?offer=first-purchase' },
  { id: 2, icon: TrendingUp, title: 'Buy 2 Get 1', description: 'On selected items', link: '/products?offer=buy2get1' },
  { id: 3, icon: Zap, title: 'Flash Sale', description: 'Up to 70% off', link: '/products?offer=flash-sale' },
  { id: 4, icon: Gift, title: 'Free Shipping', description: 'Orders above ₹999', link: '/products' },
];

export default function OffersSection() {
  return (
    <HomeSection tone="saffron" pattern="bandhani">
      <HomeSectionInner>
        <IndianSectionHeader
          badge="Limited Time"
          title="Special"
          titleAccent="Offers"
          subtitle="Festive deals you don't want to miss."
          align="center"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {offers.map((offer, i) => {
            const Icon = offer.icon;
            const accent = OFFER_ACCENTS[i % OFFER_ACCENTS.length];
            return (
              <Link key={offer.id} href={offer.link} className="group block h-full">
                <FestiveCard accent={accent} className="h-full">
                  <div className="flex flex-col items-center text-center p-5 lg:p-7 h-full">
                    <div className="mb-3 p-3 rounded-full bg-amber-50/80 border border-amber-100 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-amber-900" />
                    </div>
                    <h3 className="text-sm lg:text-base font-bold text-heading mb-1">{offer.title}</h3>
                    <p className="text-[11px] lg:text-sm text-gray-600 mb-3 flex-1">{offer.description}</p>
                    <span className="text-[10px] lg:text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Shop Now →
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
