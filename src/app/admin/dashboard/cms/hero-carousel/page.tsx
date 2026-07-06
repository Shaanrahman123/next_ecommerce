'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ImageIcon,
  GripVertical,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';
import ImageUploadField from '@/components/admin/categories/ImageUploadField';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { cmsService } from '@/services/cms.service';
import { HeroSlide, HeroSlideFormPayload } from '@/types/cms';

const emptyForm: HeroSlideFormPayload = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  link: '/products',
  buttonText: 'Shop Collection',
  sortOrder: 0,
  isActive: true,
};

export default function HeroCarouselAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<HeroSlideFormPayload>(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSlides = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await cmsService.listHeroSlides();
      setSlides(res.data || []);
    } catch {
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, sortOrder: slides.length });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: '',
      link: slide.link,
      buttonText: slide.buttonText,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editing && !form.image) {
      setError('Image is required');
      return;
    }
    if (!form.link.trim()) {
      setError('Link is required');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      const payload: HeroSlideFormPayload = {
        ...form,
        title: form.title.trim(),
        link: form.link.trim(),
        buttonText: form.buttonText?.trim() || 'Shop Collection',
      };

      if (editing) {
        const updatePayload = { ...payload };
        if (!form.image) delete (updatePayload as Partial<HeroSlideFormPayload>).image;
        await cmsService.updateHeroSlide(editing._id, updatePayload);
      } else {
        await cmsService.createHeroSlide(payload);
      }
      setModalOpen(false);
      fetchSlides();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Save failed';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await cmsService.deleteHeroSlide(deleteTarget._id);
      setDeleteTarget(null);
      fetchSlides();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Delete failed';
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActive = async (slide: HeroSlide) => {
    try {
      await cmsService.updateHeroSlide(slide._id, { isActive: !slide.isActive });
      fetchSlides();
    } catch {
      alert('Could not update slide status');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-heading tracking-tight">Hero Carousel</h1>
          <p className="text-gray-500 mt-1">
            Manage homepage hero slides — images, headings, and call-to-action links
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:scale-[1.02] transition-all shadow-lg shadow-black/5"
        >
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center space-y-4">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium">No hero slides yet</p>
          <button onClick={openCreate} className="text-primary font-bold text-sm hover:underline">
            Add your first slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide._id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${
                slide.isActive ? 'border-gray-100' : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="relative aspect-[16/9] bg-gray-100">
                <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" unoptimized />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-black/60 text-white text-[10px] font-bold uppercase rounded-lg flex items-center gap-1">
                    <GripVertical className="w-3 h-3" /> #{slide.sortOrder}
                  </span>
                  {!slide.isActive && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-lg">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 space-y-3">
                {slide.subtitle && (
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{slide.subtitle}</p>
                )}
                <h3 className="font-bold text-heading text-lg leading-tight uppercase">{slide.title}</h3>
                {slide.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{slide.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate">{slide.link}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => toggleActive(slide)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    {slide.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {slide.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => openEdit(slide)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-heading transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(slide)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-heading">{editing ? 'Edit Slide' : 'Add Slide'}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-heading text-xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
              )}

              <ImageUploadField
                label={editing ? 'Replace Image (optional)' : 'Hero Image (required)'}
                previewUrl={editing?.imageUrl}
                value={form.image}
                onChange={(base64) => setForm({ ...form, image: base64 })}
                onClear={() => setForm({ ...form, image: '' })}
              />

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Subtitle</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Tradition Meets Trends"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. ETHNIC ELEGANCE"
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-primary uppercase"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description shown on desktop"
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Button Text</label>
                <input
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  placeholder="Shop Collection"
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Link URL *</label>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/products?category=topwear"
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Sort Order</label>
                  <input
                    type="number"
                    min="0"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded accent-primary"
                    />
                    <span className="text-sm font-semibold text-gray-600">Active on homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl font-bold bg-primary text-on-primary disabled:opacity-60 transition-colors"
                >
                  {isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Add Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Slide"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}
