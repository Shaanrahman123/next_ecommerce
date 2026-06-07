'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  previewUrl?: string;
  onChange: (base64: string) => void;
  onClear?: () => void;
}

/** Resize & compress before upload to avoid Cloudinary timeouts */
async function compressImage(file: File, maxSize = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const scale = Math.min(1, maxSize / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not process image'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Invalid image file'));
    };

    img.src = url;
  });
}

export default function ImageUploadField({
  label = 'Image',
  value,
  previewUrl,
  onChange,
  onClear,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const displayUrl = localPreview || previewUrl;

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      setLocalPreview(compressed);
      onChange(compressed);
    } catch {
      alert('Could not process image. Try a different file.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
          {displayUrl ? (
            <Image src={displayUrl} alt="Preview" fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Upload className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Upload Image'}
          </button>
          {(displayUrl || value) && onClear && (
            <button
              type="button"
              onClick={() => {
                setLocalPreview(null);
                onClear();
              }}
              className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          )}
          <p className="text-xs text-gray-400">Auto-compressed to 800px. JPG/PNG/WebP, max 5MB.</p>
        </div>
      </div>
    </div>
  );
}
