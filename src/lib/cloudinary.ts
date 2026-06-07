import { v2 as cloudinary } from 'cloudinary';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop';

function envValue(key: string): string {
  return (process.env[key] || '').trim();
}

function isPlaceholder(value: string): boolean {
  return !value || value.includes('your_') || value.includes('<') || value === 'undefined';
}

export function isCloudinaryConfigured(): boolean {
  const cloudName = envValue('CLOUDINARY_CLOUD_NAME');
  const apiKey = envValue('CLOUDINARY_API_KEY');
  const apiSecret = envValue('CLOUDINARY_API_SECRET');
  return !isPlaceholder(cloudName) && !isPlaceholder(apiKey) && !isPlaceholder(apiSecret);
}

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: envValue('CLOUDINARY_CLOUD_NAME'),
    api_key: envValue('CLOUDINARY_API_KEY'),
    api_secret: envValue('CLOUDINARY_API_SECRET'),
    secure: true,
  });
}

export class CloudinaryUploadError extends Error {
  constructor(message: string, public readonly httpCode?: number) {
    super(message);
    this.name = 'CloudinaryUploadError';
  }
}

/**
 * Uploads a single file to Cloudinary.
 * Returns the public_id (folder/filename) on success.
 */
export async function uploadSingleImage(
  fileInput: File | Buffer | string | ArrayBuffer,
  folder = 'next_ecommerce'
): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new CloudinaryUploadError(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
    );
  }

  const options = {
    folder,
    resource_type: 'image' as const,
    timeout: 120000,
  };

  try {
    // Base64 data URI or remote URL — use direct upload (NOT upload_stream)
    if (typeof fileInput === 'string') {
      if (!fileInput.startsWith('data:') && !fileInput.startsWith('http://') && !fileInput.startsWith('https://')) {
        return fileInput; // already a public_id
      }
      const result = await cloudinary.uploader.upload(fileInput, options);
      return result.public_id;
    }

    // Buffer / ArrayBuffer — use upload_stream
    const buffer = Buffer.isBuffer(fileInput)
      ? fileInput
      : Buffer.from(fileInput instanceof ArrayBuffer ? fileInput : new ArrayBuffer(0));

    if (fileInput instanceof File) {
      const ab = await fileInput.arrayBuffer();
      return uploadSingleImage(Buffer.from(ab), folder);
    }

    return await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          reject(
            new CloudinaryUploadError(
              error.message || 'Cloudinary upload failed',
              (error as { http_code?: number }).http_code
            )
          );
          return;
        }
        if (!result?.public_id) {
          reject(new CloudinaryUploadError('Cloudinary returned an empty result'));
          return;
        }
        resolve(result.public_id);
      });
      stream.end(buffer);
    });
  } catch (error: unknown) {
    if (error instanceof CloudinaryUploadError) throw error;

    const cloudErr = error as { message?: string; http_code?: number };
    throw new CloudinaryUploadError(
      cloudErr.message || 'Cloudinary upload failed',
      cloudErr.http_code
    );
  }
}

export async function uploadMultipleImages(
  files: (File | Buffer | string | ArrayBuffer)[],
  folder = 'next_ecommerce'
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadSingleImage(file, folder)));
}

export async function uploadImageIfNeeded(
  fileInput: unknown,
  folder = 'next_ecommerce'
): Promise<string | undefined> {
  if (!fileInput) return undefined;

  if (typeof fileInput === 'string') {
    if (!fileInput.startsWith('data:') && !fileInput.startsWith('http://') && !fileInput.startsWith('https://')) {
      return fileInput;
    }
  }

  return uploadSingleImage(fileInput as File | Buffer | string | ArrayBuffer, folder);
}

export function getCloudinaryUrl(
  publicId?: string | null,
  options: { width?: number; height?: number; crop?: string } = {}
): string {
  if (!publicId) return PLACEHOLDER_IMAGE;
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) return publicId;

  if (!isCloudinaryConfigured()) return PLACEHOLDER_IMAGE;

  const { width = 400, height = 400, crop = 'fill' } = options;
  const id = publicId.replace(/^\//, '');

  return cloudinary.url(id, {
    secure: true,
    width,
    height,
    crop,
    fetch_format: 'auto',
    quality: 'auto',
  });
}
