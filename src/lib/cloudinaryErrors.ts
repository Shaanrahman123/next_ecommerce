import { CloudinaryUploadError } from '@/lib/cloudinary';

export function getCloudinaryErrorMessage(error: unknown): string {
  if (error instanceof CloudinaryUploadError) {
    if (error.httpCode === 401) {
      return (
        'Cloudinary authentication failed. CLOUDINARY_CLOUD_NAME must be your Cloud Name ' +
        '(shown on Dashboard → Home → Product environment credentials), NOT the API Key Name ' +
        'from Settings → API Keys. Also verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, then restart the dev server.'
      );
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Image upload failed';
}
