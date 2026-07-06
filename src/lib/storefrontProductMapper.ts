import { Product as StorefrontProduct } from '@/types';
import type { SerializedProduct } from '@/lib/productSerializer';
import type { StorefrontProductDetail } from '@/types/storefrontProduct';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';
import { COLOR_HEX } from '@/constants/colorHex';

export type { StorefrontProductDetail } from '@/types/storefrontProduct';

interface PopulatedRef {
  _id: string;
  name: string;
  slug: string;
}

function asPopulatedRef(item: unknown): PopulatedRef | null {
  if (item && typeof item === 'object' && '_id' in item && 'slug' in item) {
    const ref = item as PopulatedRef;
    return { _id: String(ref._id), name: ref.name, slug: ref.slug };
  }
  return null;
}

function detailImages(p: SerializedProduct): string[] {
  const hero = getCloudinaryUrl(p.heroImage, { width: 1200, height: 1600, crop: 'fill' });
  const gallery = (p.images || []).map((id) =>
    getCloudinaryUrl(id, { width: 1200, height: 1600, crop: 'fill' })
  );
  const all = [hero, ...gallery].filter(Boolean);
  return all.length ? all : [p.heroImageUrl];
}

function buildBreadcrumbs(
  dept: PopulatedRef | null,
  cat: PopulatedRef | null,
  sub: PopulatedRef | null,
  productName: string
): StorefrontProductDetail['breadcrumbs'] {
  const crumbs: StorefrontProductDetail['breadcrumbs'] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  if (dept) {
    crumbs.push({ label: dept.name, href: `/products?department=${dept.slug}` });
  }
  if (cat) {
    const href = dept
      ? `/products?department=${dept.slug}&category=${cat.slug}`
      : `/products?category=${cat.slug}`;
    crumbs.push({ label: cat.name, href });
  }
  if (sub) {
    const href =
      dept && cat
        ? `/products?department=${dept.slug}&category=${cat.slug}&item=${sub.slug}`
        : cat
          ? `/products?category=${cat.slug}&item=${sub.slug}`
          : `/products?item=${sub.slug}`;
    crumbs.push({ label: sub.name, href });
  }
  crumbs.push({ label: productName, href: '#' });

  return crumbs;
}

export function toStorefrontProduct(p: SerializedProduct): StorefrontProduct {
  const images = [p.heroImageUrl, ...(p.imageUrls || [])].filter(Boolean);
  const sub = asPopulatedRef(p.subCategories?.[0]);
  const category = sub?.slug || 'general';

  const colors = p.colorVariants?.map((c) => c.name) || p.colors || [];

  return {
    id: String(p._id),
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    images: images.length ? images : [p.heroImageUrl],
    category,
    gender: (p.gender as StorefrontProduct['gender']) || 'unisex',
    sizes: p.sizes || [],
    colors,
    inStock: p.inStock,
    featured: p.featured,
    rating: p.ratings,
    reviews: p.reviewsCount,
    returnDays: (p as SerializedProduct & { returnDays?: number }).returnDays ?? 10,
    isReturnable: (p as SerializedProduct & { isReturnable?: boolean }).isReturnable !== false,
  };
}

export function toStorefrontProductDetail(p: SerializedProduct): StorefrontProductDetail {
  const base = toStorefrontProduct(p);
  const dept = asPopulatedRef(p.superCategories?.[0]);
  const cat = asPopulatedRef(p.categories?.[0]);
  const sub = asPopulatedRef(p.subCategories?.[0]);

  const categoryIds = (p.categories || [])
    .map((c) => asPopulatedRef(c)?._id)
    .filter(Boolean) as string[];
  const subCategoryIds = (p.subCategories || [])
    .map((s) => asPopulatedRef(s)?._id)
    .filter(Boolean) as string[];

  const colorVariants =
    p.colorVariants?.length
      ? p.colorVariants
      : (p.colors || []).map((name) => ({
          name,
          hex: COLOR_HEX[name.toLowerCase().replace(/\s+/g, '-')] || '#9ca3af',
        }));

  const categoryLabel = sub?.name || cat?.name || base.category;

  return {
    ...base,
    images: detailImages(p),
    slug: p.slug,
    brand: p.brand,
    material: (p as SerializedProduct & { material?: string }).material,
    season: (p as SerializedProduct & { material?: string; season?: string }).season,
    returnDays: (p as SerializedProduct & { returnDays?: number }).returnDays ?? 10,
    isReturnable: (p as SerializedProduct & { isReturnable?: boolean }).isReturnable !== false,
    stockQuantity: p.stockQuantity ?? 0,
    soldQuantity: p.soldQuantity ?? 0,
    specifications: p.specifications || [],
    colorVariants,
    categoryLabel,
    breadcrumbs: buildBreadcrumbs(dept, cat, sub, p.name),
    departmentSlug: dept?.slug,
    categorySlug: cat?.slug,
    subCategorySlug: sub?.slug,
    categoryIds,
    subCategoryIds,
  };
}

export function toStorefrontProductCard(p: SerializedProduct): StorefrontProduct {
  return toStorefrontProduct(p);
}

/** Strip non-serializable values before passing to Client Components. */
export function toClientProductDetail(product: StorefrontProductDetail): StorefrontProductDetail {
  return {
    id: String(product.id),
    name: String(product.name),
    description: String(product.description),
    price: Number(product.price),
    originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
    images: product.images.map(String),
    category: String(product.category),
    gender: product.gender,
    sizes: product.sizes.map(String),
    colors: product.colors.map(String),
    inStock: Boolean(product.inStock),
    featured: product.featured,
    rating: product.rating != null ? Number(product.rating) : undefined,
    reviews: product.reviews != null ? Number(product.reviews) : undefined,
    slug: String(product.slug),
    brand: product.brand ? String(product.brand) : undefined,
    material: product.material ? String(product.material) : undefined,
    season: product.season ? String(product.season) : undefined,
    stockQuantity: Number(product.stockQuantity),
    soldQuantity: Number(product.soldQuantity ?? 0),
    returnDays: Number(product.returnDays ?? 10),
    isReturnable: product.isReturnable !== false,
    specifications: product.specifications.map((s) => ({
      key: String(s.key),
      value: String(s.value),
    })),
    colorVariants: product.colorVariants.map((c) => ({
      name: String(c.name),
      hex: String(c.hex),
    })),
    categoryLabel: String(product.categoryLabel),
    breadcrumbs: product.breadcrumbs.map((b) => ({
      label: String(b.label),
      href: String(b.href),
    })),
    departmentSlug: product.departmentSlug ? String(product.departmentSlug) : undefined,
    categorySlug: product.categorySlug ? String(product.categorySlug) : undefined,
    subCategorySlug: product.subCategorySlug ? String(product.subCategorySlug) : undefined,
    categoryIds: product.categoryIds.map(String),
    subCategoryIds: product.subCategoryIds.map(String),
  };
}

export function toClientProductList(products: StorefrontProduct[]): StorefrontProduct[] {
  return products.map((p) => ({
    ...p,
    id: String(p.id),
    images: p.images.map(String),
    sizes: p.sizes.map(String),
    colors: p.colors.map(String),
  }));
}
