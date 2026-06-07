'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  src: string;
  isNew?: boolean;
}

interface ProductGalleryFieldProps {
  heroImage: string;
  heroPreviewUrl?: string;
  gallery: GalleryItem[];
  onHeroChange: (base64: string) => void;
  onHeroClear: () => void;
  onGalleryAdd: (base64: string) => void;
  onGalleryRemove: (id: string) => void;
}

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

export default function ProductGalleryField({
  heroImage,
  heroPreviewUrl,
  gallery,
  onHeroChange,
  onHeroClear,
  onGalleryAdd,
  onGalleryRemove,
}: ProductGalleryFieldProps) {
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [heroLocalPreview, setHeroLocalPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const heroDisplay = heroLocalPreview || heroPreviewUrl || (heroImage.startsWith('data:') ? heroImage : '');

  const handleFiles = async (files: FileList | null, isHero: boolean) => {
    if (!files?.length) return;
    setIsProcessing(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is over 5MB and was skipped`);
          continue;
        }
        const compressed = await compressImage(file);
        if (isHero) {
          setHeroLocalPreview(compressed);
          onHeroChange(compressed);
        } else {
          onGalleryAdd(compressed);
        }
      }
    } catch {
      alert('Could not process one or more images.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
          Hero Image (Primary)
        </label>
        <div className="flex items-start gap-6">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
            {heroDisplay ? (
              <Image src={heroDisplay} alt="Hero" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Upload className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <input
              ref={heroInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files, true);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => heroInputRef.current?.click()}
              className="px-5 py-2.5 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Upload Hero Image'}
            </button>
            {heroDisplay && (
              <button
                type="button"
                onClick={() => {
                  setHeroLocalPreview(null);
                  onHeroClear();
                }}
                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
            Gallery Images
          </label>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => galleryInputRef.current?.click()}
            className="text-xs font-bold text-blue-600 hover:underline disabled:opacity-50"
          >
            + ADD IMAGES
          </button>
        </div>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files, false);
            e.target.value = '';
          }}
        />
        {gallery.length === 0 ? (
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="border-4 border-dashed border-gray-100 rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 bg-[#fafafa] hover:bg-white transition-all cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl">
              <Upload className="w-7 h-7 text-heading" />
            </div>
            <p className="text-sm font-bold uppercase tracking-tight text-gray-500">
              Drop additional images here
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Up to 10 images • 5MB each
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
                <Image src={item.src} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => onGalleryRemove(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {gallery.length < 10 && (
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
              >
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-xs font-bold">Add More</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
