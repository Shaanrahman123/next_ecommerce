import { Suspense } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import HeroBannerSkeleton from '@/components/home/HeroBannerSkeleton';
import CategoryGrid from '@/components/home/CategoryGrid';
import CategoryGridSkeleton from '@/components/home/CategoryGridSkeleton';
import OffersSection from '@/components/home/OffersSection';
import DripDropBanner from '@/components/home/DripDropBanner';
import CustomerReviews from '@/components/home/CustomerReviews';
import TrendingHomeSection from '@/components/home/TrendingHomeSection';
import TrendingHomeSectionSkeleton from '@/components/home/TrendingHomeSectionSkeleton';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Home() {
  return (
    <div className="bg-[#faf7f2] min-h-screen">
      <ScrollReveal direction="none" duration={0.9}>
        <Suspense fallback={<HeroBannerSkeleton />}>
          <HeroBanner />
        </Suspense>
      </ScrollReveal>

      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoryGrid />
      </Suspense>

      <ScrollReveal delay={0.05}>
        <Suspense fallback={<TrendingHomeSectionSkeleton />}>
          <TrendingHomeSection sectionId="trending-accessories" />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <OffersSection />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <Suspense fallback={<TrendingHomeSectionSkeleton />}>
          <TrendingHomeSection sectionId="trending-indian-wear" />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <DripDropBanner />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <Suspense fallback={<TrendingHomeSectionSkeleton />}>
          <TrendingHomeSection sectionId="trending-sports-wear" />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <Suspense fallback={<TrendingHomeSectionSkeleton />}>
          <TrendingHomeSection sectionId="trending-footwear" />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <CustomerReviews />
      </ScrollReveal>
    </div>
  );
}
