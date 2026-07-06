import Product from '@/models/Product';
import CategoryFilterField from '@/models/CategoryFilterField';
import ProductSpecOption from '@/models/ProductSpecOption';
import SubCategory from '@/models/SubCategory';
import { buildProductFilterFromContext, CategoryContext } from '@/lib/categoryContext';
import { COLOR_HEX } from '@/constants/colorHex';

export interface FilterOptionDto {
  id: string;
  label: string;
  count?: number;
}

export interface FilterSectionDto {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range' | 'color';
  key?: string;
  options?: FilterOptionDto[];
  min?: number;
  max?: number;
}

function slugifyKey(key: string) {
  return key.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function colorId(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export async function getFilterFieldsForSubCategory(subCategoryId: string) {
  return CategoryFilterField.find({ subCategory: subCategoryId, isActive: true }).sort({
    sortOrder: 1,
    label: 1,
  });
}

export async function getFilterFieldsForContext(ctx: CategoryContext) {
  if (ctx.subCategoryId) {
    return getFilterFieldsForSubCategory(ctx.subCategoryId);
  }

  if (ctx.categoryId) {
    const subs = await SubCategory.find({ category: ctx.categoryId, isActive: true }).select('_id');
    const subIds = subs.map((s) => s._id);
    const fields = await CategoryFilterField.find({
      subCategory: { $in: subIds },
      isActive: true,
    }).sort({ sortOrder: 1, label: 1 });

    const seen = new Set<string>();
    return fields.filter((f) => {
      const k = f.key.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  return [];
}

function departmentFilterOptions(depts: { slug: string; name: string }[]): FilterOptionDto[] {
  const options: FilterOptionDto[] = [];
  for (const dept of depts) {
    if (dept.slug === 'kids') {
      options.push({ id: 'boys', label: 'Boys' }, { id: 'girls', label: 'Girls' });
    } else {
      options.push({ id: dept.slug, label: dept.name });
    }
  }
  return options;
}

export async function buildDynamicFilterSections(ctx: CategoryContext): Promise<FilterSectionDto[]> {
  const baseFilter = await buildProductFilterFromContext(ctx);
  const products = await Product.find(baseFilter).select(
    'specifications brand colors colorVariants price originalPrice superCategories gender'
  );

  const fields = await getFilterFieldsForContext(ctx);
  const sections: FilterSectionDto[] = [];

  const showDepartmentFilter =
    !ctx.departmentSlug &&
    ctx.linkedDepartments &&
    ctx.linkedDepartments.length > 1;

  if (showDepartmentFilter && ctx.linkedDepartments) {
    const deptOptions = departmentFilterOptions(ctx.linkedDepartments);
    const deptCounts = new Map<string, number>();

    for (const p of products) {
      const pDepts = (p.superCategories || []).map((id) => String(id));
      for (const dept of ctx.linkedDepartments) {
        if (pDepts.includes(dept.id)) {
          if (dept.slug === 'kids') {
            deptCounts.set('boys', (deptCounts.get('boys') || 0) + 1);
            deptCounts.set('girls', (deptCounts.get('girls') || 0) + 1);
          } else {
            deptCounts.set(dept.slug, (deptCounts.get(dept.slug) || 0) + 1);
          }
        }
      }
    }

    sections.push({
      id: 'department',
      title: 'GENDER',
      type: 'radio',
      key: 'department',
      options: deptOptions.map((o) => ({ ...o, count: deptCounts.get(o.id) || 0 })),
    });
  }

  for (const field of fields) {
    const key = field.key;
    const sectionId = slugifyKey(key);

    const valueCounts = new Map<string, number>();
    for (const p of products) {
      const spec = (p.specifications || []).find(
        (s: { key: string; value: string }) => s.key.toLowerCase() === key.toLowerCase()
      );
      if (spec?.value) {
        valueCounts.set(spec.value, (valueCounts.get(spec.value) || 0) + 1);
      }
    }

    const dbOptions = await ProductSpecOption.find({
      key,
      $or: [{ subCategory: null }, ...(ctx.subCategoryId ? [{ subCategory: ctx.subCategoryId }] : [])],
    }).sort({ value: 1 });

    const optionSet = new Set<string>();
    dbOptions.forEach((o) => optionSet.add(o.value));
    valueCounts.forEach((_, v) => optionSet.add(v));

    const options: FilterOptionDto[] = Array.from(optionSet).map((label) => ({
      id: slugifyKey(label),
      label,
      count: valueCounts.get(label) || 0,
    }));

    sections.push({
      id: sectionId,
      title: field.label.toUpperCase(),
      type: 'checkbox',
      key,
      options,
    });
  }

  const brandCounts = new Map<string, number>();
  const colorCounts = new Map<string, number>();
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const p of products) {
    if (p.brand) brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
    if (p.colorVariants?.length) {
      for (const c of p.colorVariants) {
        colorCounts.set(c.name, (colorCounts.get(c.name) || 0) + 1);
      }
    } else if (p.colors?.length) {
      for (const c of p.colors) {
        colorCounts.set(c, (colorCounts.get(c) || 0) + 1);
      }
    }
    if (p.price < minPrice) minPrice = p.price;
    if (p.price > maxPrice) maxPrice = p.price;
  }

  if (brandCounts.size > 0) {
    sections.push({
      id: 'brand',
      title: 'BRAND',
      type: 'checkbox',
      key: 'brand',
      options: Array.from(brandCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({ id: slugifyKey(label), label, count })),
    });
  }

  sections.push({
    id: 'price',
    title: 'PRICE',
    type: 'range',
    min: minPrice === Infinity ? 0 : Math.floor(minPrice),
    max: maxPrice === 0 ? 10000 : Math.ceil(maxPrice),
  });

  if (colorCounts.size > 0) {
    sections.push({
      id: 'color',
      title: 'COLOR',
      type: 'color',
      key: 'color',
      options: Array.from(colorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({ id: colorId(label), label, count })),
    });
  }

  sections.push({
    id: 'discount',
    title: 'DISCOUNT RANGE',
    type: 'radio',
    key: 'discount',
    options: [
      { id: '10-above', label: '10% and above' },
      { id: '20-above', label: '20% and above' },
      { id: '30-above', label: '30% and above' },
      { id: '40-above', label: '40% and above' },
      { id: '50-above', label: '50% and above' },
    ],
  });

  return sections;
}

export function parseSpecFiltersFromSearchParams(searchParams: URLSearchParams, fieldKeys: string[]) {
  const specs: Record<string, string[]> = {};

  for (const key of fieldKeys) {
    const sectionId = slugifyKey(key);
    const param = searchParams.get(`spec_${sectionId}`) || searchParams.get(`spec_${key}`);
    if (param) {
      specs[key] = param.split(',').map((v) => decodeURIComponent(v.trim())).filter(Boolean);
    }
  }

  return specs;
}

export function applySpecFiltersToQuery(
  filter: Record<string, unknown>,
  specs: Record<string, string[]>
) {
  const entries = Object.entries(specs).filter(([, vals]) => vals.length > 0);
  if (!entries.length) return filter;

  filter.$and = (filter.$and as unknown[] | undefined) || [];
  for (const [key, values] of entries) {
    (filter.$and as unknown[]).push({
      specifications: {
        $elemMatch: {
          key: { $regex: new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
          value: { $in: values },
        },
      },
    });
  }
  return filter;
}

export { slugifyKey, COLOR_HEX };
