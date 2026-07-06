import { FilterSection } from '@/types/filters';

const DISCOUNT_MAP: Record<string, number> = {
  '10-above': 10,
  '20-above': 20,
  '30-above': 30,
  '40-above': 40,
  '50-above': 50,
  '60-above': 60,
  '70-above': 70,
  '80-above': 80,
};

function labelsFromSection(
  sections: FilterSection[],
  sectionId: string,
  optionIds: string[]
): string[] {
  const section = sections.find((s) => s.id === sectionId);
  if (!section?.options) return optionIds;
  return optionIds
    .map((id) => section.options!.find((o) => o.id === id)?.label || id)
    .filter(Boolean);
}

export function buildProductQueryParams(options: {
  department?: string | null;
  category?: string | null;
  item?: string | null;
  filters: Record<string, unknown>;
  sections: FilterSection[];
  priceRange: number[];
  sortBy: string;
  page: number;
  limit: number;
}): URLSearchParams {
  const params = new URLSearchParams();

  const deptFilter = options.filters.department;
  if (typeof deptFilter === 'string' && deptFilter) {
    params.set('department', deptFilter);
  } else if (options.department) {
    params.set('department', options.department);
  }
  if (options.category) params.set('category', options.category);
  if (options.item) params.set('item', options.item);

  params.set('page', String(options.page));
  params.set('limit', String(options.limit));

  const sortMap: Record<string, string> = {
    recommended: 'newest',
    popularity: 'newest',
    newest: 'newest',
    'price-low-high': 'price-low-high',
    'price-high-low': 'price-high-low',
    rating: 'rating',
    discount: 'discount',
  };
  params.set('sortBy', sortMap[options.sortBy] || 'newest');

  const priceSection = options.sections.find((s) => s.id === 'price');
  const minBound = priceSection?.min ?? 0;
  const maxBound = priceSection?.max ?? 100000;

  if (options.priceRange[0] > minBound) {
    params.set('minPrice', String(options.priceRange[0]));
  }
  if (options.priceRange[1] < maxBound) {
    params.set('maxPrice', String(options.priceRange[1]));
  }

  const brandIds = options.filters.brand;
  if (Array.isArray(brandIds) && brandIds.length) {
    const labels = labelsFromSection(options.sections, 'brand', brandIds as string[]);
    if (labels.length) params.set('brand', labels.map(encodeURIComponent).join(','));
  }

  const colorIds = options.filters.color;
  if (Array.isArray(colorIds) && colorIds.length) {
    const labels = labelsFromSection(options.sections, 'color', colorIds as string[]);
    if (labels.length) params.set('colors', labels.map(encodeURIComponent).join(','));
  }

  const discountId = options.filters.discount;
  if (typeof discountId === 'string' && DISCOUNT_MAP[discountId]) {
    params.set('discountMin', String(DISCOUNT_MAP[discountId]));
  }

  for (const section of options.sections) {
    if (
      !section.key ||
      section.type === 'range' ||
      section.id === 'brand' ||
      section.id === 'color' ||
      section.id === 'discount' ||
      section.id === 'department'
    ) {
      continue;
    }
    const val = options.filters[section.id];
    if (Array.isArray(val) && val.length) {
      const labels = labelsFromSection(options.sections, section.id, val as string[]);
      if (labels.length) {
        params.set(`spec_${section.id}`, labels.map(encodeURIComponent).join(','));
      }
    }
  }

  return params;
}

export function getAppliedFilterLabels(
  filters: Record<string, unknown>,
  sections: FilterSection[]
): { id: string; label: string; section: string }[] {
  const applied: { id: string; label: string; section: string }[] = [];

  for (const section of sections) {
    const val = filters[section.id];
    if (section.type === 'range') continue;

    if (Array.isArray(val) && val.length) {
      for (const id of val as string[]) {
        const label = section.options?.find((o) => o.id === id)?.label || id;
        applied.push({ id, label, section: section.id });
      }
    } else if (typeof val === 'string' && val) {
      const label = section.options?.find((o) => o.id === val)?.label || val;
      applied.push({ id: val, label, section: section.id });
    }
  }

  return applied;
}
