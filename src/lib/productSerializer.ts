import { getCloudinaryUrl } from '@/lib/cloudinary';

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
  isActive: boolean;
  featured: boolean;
  homeSections?: string[];
  gender: string;
  sizes?: string[];
  colors?: string[];
  colorVariants?: { name: string; hex: string }[];
  brand?: string;
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
    heroImageUrl: getCloudinaryUrl(plain.heroImage as string, { width: 400, height: 400 }),
    imageUrls: ((plain.images as string[]) || []).map((id) =>
      getCloudinaryUrl(id, { width: 800, height: 800 })
    ),
  };
}

export function serializeProductList(docs: Record<string, unknown>[]) {
  return docs.map(serializeProduct);
}
