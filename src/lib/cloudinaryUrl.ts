const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop';

function getCloudName(): string {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    ''
  ).trim();
}

function isInvalidCloudName(name: string): boolean {
  return !name || name.includes('your_') || name.includes('<') || name === 'undefined';
}

/** Build a Cloudinary delivery URL without the Node SDK (safe for client bundles). */
export function getCloudinaryUrl(
  publicId?: string | null,
  options: { width?: number; height?: number; crop?: string } = {}
): string {
  if (!publicId) return PLACEHOLDER_IMAGE;
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) return publicId;

  const cloudName = getCloudName();
  if (isInvalidCloudName(cloudName)) return PLACEHOLDER_IMAGE;

  const { width = 400, height = 400, crop = 'fill' } = options;
  const id = publicId.replace(/^\//, '');
  const transforms = `c_${crop},w_${width},h_${height},f_auto,q_auto`;
  // Folder-based public_ids (e.g. sub_categories/xxx) need a version segment
  const versionPrefix = id.includes('/') ? 'v1/' : '';

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${versionPrefix}${id}`;
}

export { PLACEHOLDER_IMAGE };
