export const HOME_SECTION_IDS = [
  'trending-accessories',
  'trending-indian-wear',
  'trending-sports-wear',
  'trending-footwear',
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

export interface HomePageSection {
  id: HomeSectionId;
  label: string;
  description: string;
}

export const HOME_SECTION_DISPLAY_TITLES: Record<HomeSectionId, string> = {
  'trending-accessories': 'Trending In Accessories',
  'trending-indian-wear': 'Trending In Indian Wear',
  'trending-sports-wear': 'Trending In Sports Wear',
  'trending-footwear': 'Trending In Footwear',
};

export const HOME_SECTION_BG: Record<HomeSectionId, string> = {
  'trending-accessories': 'bg-white',
  'trending-indian-wear': 'bg-gray-50',
  'trending-sports-wear': 'bg-white',
  'trending-footwear': 'bg-gray-50',
};

export const HOME_PAGE_SECTIONS: HomePageSection[] = [
  {
    id: 'trending-accessories',
    label: 'Trending Accessories',
    description: 'Accessories carousel on the homepage',
  },
  {
    id: 'trending-indian-wear',
    label: 'Trending Indian Wear',
    description: 'Indian / ethnic wear carousel on the homepage',
  },
  {
    id: 'trending-sports-wear',
    label: 'Trending Sports Wear',
    description: 'Activewear & sports styles carousel on the homepage',
  },
  {
    id: 'trending-footwear',
    label: 'Trending Footwear',
    description: 'Footwear carousel on the homepage',
  },
];

const INDIAN_WEAR_SUB_SLUGS = [
  'kurtas',
  'ethnic-wear',
  'sherwanis',
  'kurta-sets',
  'nehru-jackets',
  'sarees',
  'lehengas',
  'salwar-suits',
];

const SPORTS_WEAR_SUB_SLUGS = [
  'sweatshirts',
  'hoodies',
  'track-pants',
  'joggers',
  'sports-shoes',
  'sneakers',
  'sports-wear',
  'activewear',
  'shorts',
  'jackets',
];

function matchesAny(slug: string, patterns: string[]): boolean {
  const normalized = slug.toLowerCase();
  return patterns.some(
    (p) => normalized === p || normalized.includes(p) || p.includes(normalized)
  );
}

function isSectionEligible(
  sectionId: HomeSectionId,
  groupSlug: string,
  subCategorySlug?: string
): boolean {
  const group = groupSlug.toLowerCase();
  const sub = (subCategorySlug || '').toLowerCase();

  switch (sectionId) {
    case 'trending-accessories':
      return group === 'accessories';

    case 'trending-footwear':
      return group === 'footwear';

    case 'trending-indian-wear':
      if (group !== 'topwear') return false;
      if (!sub) return false;
      return matchesAny(sub, INDIAN_WEAR_SUB_SLUGS);

    case 'trending-sports-wear':
      if (group === 'sportswear' || group === 'sports-wear' || group === 'activewear') {
        return true;
      }
      if (!sub) return false;
      if (group === 'topwear' || group === 'bottomwear' || group === 'footwear') {
        return matchesAny(sub, SPORTS_WEAR_SUB_SLUGS);
      }
      return false;

    default:
      return false;
  }
}

export function isSectionEligibleForCategory(
  sectionId: HomeSectionId,
  groupSlug: string,
  subCategorySlug?: string
): boolean {
  return isSectionEligible(sectionId, groupSlug, subCategorySlug);
}

/** Returns homepage sections a product can be assigned to based on its category path. */
export function getEligibleHomeSections(
  groupSlug: string,
  subCategorySlug?: string
): HomePageSection[] {
  if (!groupSlug) return [];

  return HOME_PAGE_SECTIONS.filter((section) =>
    isSectionEligible(section.id, groupSlug, subCategorySlug)
  );
}

export function isValidHomeSectionId(id: string): id is HomeSectionId {
  return (HOME_SECTION_IDS as readonly string[]).includes(id);
}

/** Keep only valid section IDs — used when saving (no category filter; homepage handles display). */
export function sanitizeHomeSections(sections: string[]): HomeSectionId[] {
  return sections.filter((id): id is HomeSectionId => isValidHomeSectionId(id));
}

export function filterValidHomeSections(
  sections: string[],
  groupSlug: string,
  subCategorySlug?: string
): HomeSectionId[] {
  const eligible = new Set(
    getEligibleHomeSections(groupSlug, subCategorySlug).map((s) => s.id)
  );
  return sections.filter(
    (id): id is HomeSectionId => isValidHomeSectionId(id) && eligible.has(id)
  );
}
