import { HomeSectionId } from '@/constants/homeSections';
import { IndianPattern, SectionTone } from '@/components/home/indian/IndianDecor';

export interface SectionTheme {
  badge: string;
  titleMain: string;
  titleAccent?: string;
  subtitle: string;
  tone: SectionTone;
  pattern: IndianPattern;
  cardAccent: 'amber' | 'rose' | 'maroon' | 'saffron';
}

export const TRENDING_SECTION_THEMES: Record<HomeSectionId, SectionTheme> = {
  'trending-accessories': {
    badge: 'Style Essentials',
    titleMain: 'Trending In',
    titleAccent: 'Accessories',
    subtitle: 'Watches, bags & finishing touches for every look.',
    tone: 'blush',
    pattern: 'bandhani',
    cardAccent: 'rose',
  },
  'trending-indian-wear': {
    badge: 'Ethnic Elegance',
    titleMain: 'Trending In',
    titleAccent: 'Indian Wear',
    subtitle: 'Kurtas, sarees & festive collections crafted with love.',
    tone: 'maroon-wash',
    pattern: 'rangoli',
    cardAccent: 'maroon',
  },
  'trending-sports-wear': {
    badge: 'Active Living',
    titleMain: 'Trending In',
    titleAccent: 'Sports Wear',
    subtitle: 'Performance meets style — gear up and go.',
    tone: 'saffron',
    pattern: 'ikat',
    cardAccent: 'saffron',
  },
  'trending-footwear': {
    badge: 'Step In Style',
    titleMain: 'Trending In',
    titleAccent: 'Footwear',
    subtitle: 'Sneakers, sandals & shoes for every occasion.',
    tone: 'cream',
    pattern: 'paisley',
    cardAccent: 'amber',
  },
};

export const OFFER_ACCENTS = ['amber', 'maroon', 'saffron', 'rose'] as const;
