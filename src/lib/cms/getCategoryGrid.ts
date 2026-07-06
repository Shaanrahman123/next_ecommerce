import dbConnect from '@/lib/dbConnect';
import SubCategory from '@/models/SubCategory';
import { getCloudinaryUrl, PLACEHOLDER_IMAGE } from '@/lib/cloudinaryUrl';
import { resolveCategoryImageUrl } from '@/utils/categoryImage';

export interface CategoryGridItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  departmentLabel?: string;
}

function resolveGridImageUrl(image?: string): string {
  if (!image) return PLACEHOLDER_IMAGE;

  const resolved = resolveCategoryImageUrl(image);
  if (resolved) return resolved;

  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  return getCloudinaryUrl(image, { width: 900, height: 1100, crop: 'fill' });
}

function defaultDescription(name: string, deptName?: string): string {
  if (deptName) {
    return `Explore curated ${name.toLowerCase()} for ${deptName.toLowerCase()} — styles picked for every occasion.`;
  }
  return `Discover our handpicked ${name.toLowerCase()} collection — from everyday essentials to festive favourites.`;
}

/** Server-side fetch for "Categories To Bag" grid — active sub-categories. */
export async function getCategoryGridItems(limit = 4): Promise<CategoryGridItem[]> {
  await dbConnect();

  const items = await SubCategory.find({ isActive: true })
    .populate({
      path: 'category',
      populate: { path: 'superCategories', select: 'slug name' },
    })
    .sort({ sortOrder: 1, name: 1 })
    .limit(limit)
    .lean();

  return items.map((item) => {
    const category = item.category as {
      slug?: string;
      superCategories?: Array<{ slug: string; name: string }>;
    } | null;
    const groupSlug = category?.slug || 'topwear';
    const depts = category?.superCategories || [];
    const deptSlug = depts.length === 1 ? depts[0].slug : undefined;
    const deptName = depts.length === 1 ? depts[0].name : undefined;

    const imageUrl = resolveGridImageUrl(item.image as string | undefined);
    const description =
      (item.description as string | undefined)?.trim() ||
      defaultDescription(String(item.name), deptName);

    const query = deptSlug
      ? `department=${deptSlug}&category=${groupSlug}&item=${item.slug}`
      : `category=${groupSlug}&item=${item.slug}`;

    return {
      id: String(item._id),
      title: String(item.name),
      description,
      imageUrl,
      link: `/products?${query}`,
      departmentLabel: deptName,
    };
  });
}
