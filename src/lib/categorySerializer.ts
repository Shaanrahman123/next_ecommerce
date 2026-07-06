import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';

export function withImageUrl<T extends { image?: string }>(
  doc: T,
  size = 200
): T & { imageUrl: string } {
  const plain =
    doc && typeof doc === 'object' && 'toObject' in doc && typeof (doc as { toObject?: () => T }).toObject === 'function'
      ? (doc as { toObject: () => T }).toObject()
      : { ...doc };

  return {
    ...plain,
    imageUrl: getCloudinaryUrl(plain.image, { width: size, height: size }),
  };
}

export function serializeDocList<T extends { image?: string }>(docs: T[], size = 200) {
  return docs.map((doc) => withImageUrl(doc, size));
}
