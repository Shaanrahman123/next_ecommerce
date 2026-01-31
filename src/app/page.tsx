import HeroBanner from '@/components/home/HeroBanner';
import OffersSection from '@/components/home/OffersSection';
import TrendingCategoriesSection from '@/components/home/TrendingCategoriesSection';
import DripDropBanner from '@/components/home/DripDropBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import SaleSection from '@/components/home/SaleSection';
import BeautySection from '@/components/home/BeautySection';
import TrendingSection from '@/components/home/TrendingSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CustomerReviews from '@/components/home/CustomerReviews';
import FeaturesSection from '@/components/home/FeaturesSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import TrendingIndianWear from '@/components/home/TrendingIndianWear';
import TrendingSportsWear from '@/components/home/TrendingSportsWear';
import TrendingFootwear from '@/components/home/TrendingFootwear';
import TrendingAccessories from '@/components/home/TrendingAccessories';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryGrid />
      <TrendingAccessories />
      <OffersSection />
      <TrendingIndianWear />
      <DripDropBanner />
      <TrendingSportsWear />
      <TrendingFootwear />
      {/* <BeautySection /> */}
      <CustomerReviews />
      <FeaturesSection />
      <NewsletterSection />
    </div>
  );
}
