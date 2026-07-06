/** Maps sub-category slug fragments to preset keys in admin API */
export const SPEC_PRESET_BY_SLUG: Record<string, string> = {
  watch: 'watches',
  watches: 'watches',
  't-shirts': 't-shirts',
  shirts: 'shirts',
  jeans: 'jeans',
  footwear: 'footwear',
  shoes: 'footwear',
  sneakers: 'footwear',
  bags: 'bags',
  bag: 'bags',
  accessories: 'accessories',
};

export function suggestPresetForSlug(slug: string): string | null {
  const normalized = slug.toLowerCase().trim();
  if (SPEC_PRESET_BY_SLUG[normalized]) return SPEC_PRESET_BY_SLUG[normalized];

  for (const [fragment, preset] of Object.entries(SPEC_PRESET_BY_SLUG)) {
    if (normalized.includes(fragment)) return preset;
  }
  return null;
}

export const SPEC_PRESET_LABELS: Record<string, string> = {
  topwear: 'Topwear (Fabric, Fit, Pattern…)',
  't-shirts': 'T-Shirts',
  shirts: 'Shirts',
  jeans: 'Jeans',
  bottomwear: 'Bottomwear',
  footwear: 'Footwear',
  watches: 'Watches & Timepieces',
  accessories: 'Accessories',
  bags: 'Bags',
};
