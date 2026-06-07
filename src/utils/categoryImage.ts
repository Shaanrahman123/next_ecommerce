const PLACEHOLDER =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop';

function isPlaceholderCloud(cloud?: string) {
  return !cloud || cloud.includes('your_');
}

function buildFromPublicId(image: string, width = 200, height = 200): string | undefined {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (isPlaceholderCloud(cloudName)) return undefined;

  const id = image.replace(/^\//, '');
  // /v1/ = latest version — required for folder-based public_ids (e.g. sub_categories/xxx)
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_${width},h_${height}/v1/${id}`;
}

/**
 * Builds a display URL for category images.
 * Prefers public_id (reliable) over API imageUrl (may be stale/wrong format).
 */
export function resolveCategoryImageUrl(image?: string, imageUrl?: string): string | undefined {
  if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
    const built = buildFromPublicId(image);
    if (built) return built;
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
