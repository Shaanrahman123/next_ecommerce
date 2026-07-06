import { getCloudinaryUrl, PLACEHOLDER_IMAGE } from '@/lib/cloudinaryUrl';

function toPlain<T extends Record<string, unknown>>(doc: T | { toObject?: () => T }): T {
  if (doc && typeof doc === 'object' && 'toObject' in doc && typeof doc.toObject === 'function') {
    return doc.toObject() as T;
  }
  return { ...doc } as T;
}

export interface SerializedProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  heroImage: string;
  heroImageUrl: string;
  images: string[];
  imageUrls: string[];
  superCategories: unknown[];
  categories: unknown[];
  subCategories: unknown[];
  inStock: boolean;
  stockQuantity: number;
  soldQuantity: number;
  isActive: boolean;
  featured: boolean;
  homeSections?: string[];
  gender: string;
  sizes?: string[];
  colors?: string[];
  colorVariants?: { name: string; hex: string }[];
  brand?: string;
  material?: string;
  season?: string;
  specifications?: { key: string; value: string }[];
  ratings: number;
  reviewsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export function serializeProduct(doc: Record<string, unknown>): SerializedProduct {
  const plain = toPlain(doc);

  return {
    ...(plain as unknown as SerializedProduct),
    _id: String(plain._id),
    heroImageUrl: getCloudinaryUrl(plain.heroImage as string, { width: 400, height: 400 }),
    imageUrls: ((plain.images as string[]) || []).map((id) =>
      getCloudinaryUrl(id, { width: 800, height: 800 })
    ),
    specifications: ((plain.specifications as { key: string; value: string }[]) || []).map((s) => ({
      key: String(s.key),
      value: String(s.value),
    })),
    colorVariants: ((plain.colorVariants as { name: string; hex: string }[]) || []).map((c) => ({
      name: String(c.name),
      hex: String(c.hex),
    })),
    sizes: ((plain.sizes as string[]) || []).map(String),
    colors: ((plain.colors as string[]) || []).map(String),
  };
}

export function serializeProductList(docs: Record<string, unknown>[]) {
  return docs.map(serializeProduct);
}

export { PLACEHOLDER_IMAGE };
