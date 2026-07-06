import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';
import { HomeSectionId } from '@/constants/homeSections';

export interface TrendingProductItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  badge?: string | null;
}

export async function getHomeSectionProducts(
  sectionId: HomeSectionId,
  limit = 12
): Promise<TrendingProductItem[]> {
  await dbConnect();

  const products = await Product.find({ isActive: true, homeSections: sectionId })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return products.map((p) => {
    const hasDiscount =
      p.originalPrice && p.originalPrice > p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return {
      id: String(p._id),
      title: String(p.name),
      subtitle: p.brand || 'New arrival',
      image: getCloudinaryUrl(p.heroImage as string, { width: 600, height: 800, crop: 'fill' }),
      link: `/products/${p._id}`,
      badge: hasDiscount > 0 ? `${hasDiscount}% OFF` : p.featured ? 'Featured' : null,
    };
  });
}
