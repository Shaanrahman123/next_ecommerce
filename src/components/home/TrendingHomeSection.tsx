import {
  HOME_SECTION_DISPLAY_TITLES,
  HomeSectionId,
} from '@/constants/homeSections';
import { getHomeSectionProducts } from '@/lib/cms/getHomeSectionProducts';
import TrendingSlider from '@/components/ui/TrendingSlider';
import { TRENDING_SECTION_THEMES } from '@/components/home/indian/sectionThemes';

interface TrendingHomeSectionProps {
  sectionId: HomeSectionId;
}

export default async function TrendingHomeSection({ sectionId }: TrendingHomeSectionProps) {
  const items = await getHomeSectionProducts(sectionId);
  if (items.length === 0) return null;

  const theme = TRENDING_SECTION_THEMES[sectionId];

  return (
    <TrendingSlider
      items={items.map((item, i) => ({ ...item, id: i + 1 }))}
      theme={{
        ...theme,
        titleAccent: theme.titleAccent || HOME_SECTION_DISPLAY_TITLES[sectionId].replace('Trending In ', ''),
      }}
    />
  );
}
