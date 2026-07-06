import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop';

/**
 * Builds a display URL for category images.
 * Prefers public_id (reliable) over API imageUrl (may be stale/wrong format).
 */
export function resolveCategoryImageUrl(image?: string, imageUrl?: string): string | undefined {
  if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
    const built = getCloudinaryUrl(image, { width: 800, height: 800, crop: 'fill' });
    if (built && !built.includes('unsplash.com')) return built;
  }

  if (image?.startsWith('http://') || image?.startsWith('https://')) {
    return image;
  }

  if (imageUrl?.startsWith('https://') && !imageUrl.includes('unsplash.com/photo-1521572163474')) {
    return imageUrl;
  }

  return undefined;
}

export { PLACEHOLDER as CATEGORY_IMAGE_PLACEHOLDER };
