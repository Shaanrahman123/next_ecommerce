import { SerializedHeroSlide } from '@/lib/cms/heroSerializer';

export type HeroSlide = SerializedHeroSlide;

export interface HeroSlideFormPayload {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link: string;
  buttonText?: string;
  sortOrder?: number;
  isActive?: boolean;
}
