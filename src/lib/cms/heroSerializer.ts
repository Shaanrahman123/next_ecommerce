import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';

export interface SerializedHeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function serializeHeroSlide(doc: Record<string, unknown>): SerializedHeroSlide {
  const image = String(doc.image || '');
  return {
    _id: String(doc._id),
    title: String(doc.title || ''),
    subtitle: String(doc.subtitle || ''),
    description: String(doc.description || ''),
    image,
    imageUrl: getCloudinaryUrl(image, { width: 2000, height: 1200, crop: 'fill' }),
    link: String(doc.link || '/products'),
    buttonText: String(doc.buttonText || 'Shop Collection'),
    sortOrder: Number(doc.sortOrder ?? 0),
    isActive: Boolean(doc.isActive ?? true),
    createdAt: doc.createdAt ? new Date(doc.createdAt as string).toISOString() : new Date().toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as string).toISOString() : new Date().toISOString(),
  };
}

export function serializeHeroSlideList(docs: Record<string, unknown>[]) {
  return docs.map(serializeHeroSlide);
}
