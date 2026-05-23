import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary only if credentials are provided
const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a single file to Cloudinary.
 * If credentials are missing, it returns a fallback mock URL.
 * Supports File object, Buffer, Base64 string, or ArrayBuffer.
 * Returns the public_id (folder + filename) on success.
 */
export async function uploadSingleImage(
  fileInput: File | Buffer | string | ArrayBuffer,
  folder = 'next_ecommerce'
): Promise<string> {
  if (!isConfigured) {
    console.warn('[CLOUDINARY] Credentials not configured. Returning fallback mock URL.');
    
    // Fallback logic: if input is already a URL string, return it. Otherwise return placeholder mock URL.
    if (typeof fileInput === 'string' && fileInput.startsWith('http')) {
      return fileInput;
    }
    return `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('[CLOUDINARY] Upload stream error:', error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Cloudinary upload returned empty result'));
        }
        // Return public_id (e.g. next_ecommerce/xyz_123456)
        resolve(result.public_id);
      }
    );

    // Write file content based on input type
    if (fileInput instanceof File) {
      fileInput.arrayBuffer().then((ab) => {
        uploadStream.end(Buffer.from(ab));
      }).catch(reject);
    } else if (fileInput instanceof ArrayBuffer) {
      uploadStream.end(Buffer.from(fileInput));
    } else if (Buffer.isBuffer(fileInput)) {
      uploadStream.end(fileInput);
    } else if (typeof fileInput === 'string') {
      // If it's base64 data URL or external URL, upload directly
      cloudinary.uploader.upload(fileInput, { folder })
        .then((res) => resolve(res.public_id))
        .catch(reject);
    } else {
      reject(new Error('Unsupported file input type for Cloudinary upload'));
    }
  });
}

/**
 * Uploads multiple files to Cloudinary concurrently.
 * Returns public_ids.
 */
export async function uploadMultipleImages(
  files: (File | Buffer | string | ArrayBuffer)[],
  folder = 'next_ecommerce'
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadSingleImage(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Helper to upload image only if it's a new file (e.g., base64 string or file buffer).
 * If it's already a relative path/public_id, returns it as is.
 */
export async function uploadImageIfNeeded(
  fileInput: any,
  folder = 'next_ecommerce'
): Promise<string | undefined> {
  if (!fileInput) return undefined;
  
  if (typeof fileInput === 'string') {
    // If it's a base64 data URI or an external HTTP URL, upload it.
    // Otherwise, if it's already a path/public_id (e.g. next_ecommerce/abc), return it directly.
    if (!fileInput.startsWith('data:') && !fileInput.startsWith('http://') && !fileInput.startsWith('https://')) {
      return fileInput;
    }
  }

  return uploadSingleImage(fileInput, folder);
}
