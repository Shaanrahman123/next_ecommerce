import { getHeroSlides } from '@/lib/cms/getHeroSlides';
import HeroBannerCarousel from '@/components/home/HeroBannerCarousel';

export default async function HeroBanner() {
  const slides = await getHeroSlides();
  return <HeroBannerCarousel slides={slides} />;
}
