'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Plus, Pencil, Trash2, Loader2, FileText, Eye, EyeOff, ExternalLink, X, Check,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { cmsService } from '@/services/cms.service';
import { CmsPage, CmsPageFormPayload } from '@/types/cms';

// Lazy-load the editor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor'),
  { ssr: false, loading: () => <div className="h-96 bg-gray-50 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading editor...</div> }
);

// Predefined page slugs the site relies on — shown with locked icons
const SYSTEM_SLUGS = ['contact', 'faq', 'shipping', 'returns', 'privacy', 'terms'];
const SLUG_LABELS: Record<string, string> = {
  contact: 'Contact Us',
  faq: 'FAQ',
  shipping: 'Shipping Info',
  returns: 'Returns Policy',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
};

const emptyForm: CmsPageFormPayload = {
  slug: '',
  title: '',
  metaDescription: '',
  content: '',
  isPublished: true,
};

export default function CmsPagesAdminPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<CmsPageFormPayload>(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CmsPage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await cmsService.listPages();
      setPages(res.data || []);
    } catch {
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openCreate = (suggestedSlug?: string) => {
    setEditingSlug(null);
    setForm({
      ...emptyForm,
      slug: suggestedSlug || '',
      title: suggestedSlug ? (SLUG_LABELS[suggestedSlug] || '') : '',
    });
    setError('');
    setModalOpen(true);
  };

  const openEdit = async (page: CmsPage) => {
    setEditingSlug(page.slug);
    setError('');
    try {
      const res = await cmsService.getPage(page.slug);
      const full = res.data!;
      setForm({
        slug: full.slug,
        title: full.title,
        metaDescription: full.metaDescription || '',
        content: full.content || '',
        isPublished: full.isPublished,
      });
    } catch {
      setForm({
        slug: page.slug,
        title: page.title,
        metaDescription: page.metaDescription || '',
        content: '',
        isPublished: page.isPublished,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!editingSlug && !form.slug.trim()) { setError('Slug is required'); return; }

    setIsSaving(true);
    setError('');
    try {
      if (editingSlug) {
        await cmsService.updatePage(editingSlug, {
          title: form.title.trim(),
          metaDescription: form.metaDescription?.trim(),
          content: form.content,
          isPublished: form.isPublished,
        });
        showSuccess(`"${form.title}" updated successfully`);
      } else {
        await cmsService.createPage({
          slug: form.slug.toLowerCase().trim(),
          title: form.title.trim(),
          metaDescription: form.metaDescription?.trim(),
          content: form.content,
          isPublished: form.isPublished,
        });
        showSuccess(`"${form.title}" created successfully`);
      }
      setModalOpen(false);
      fetchPages();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : 'Save failed';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await cmsService.deletePage(deleteTarget.slug);
      setDeleteTarget(null);
      showSuccess('Page deleted');
      fetchPages();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: string }).message)
        : 'Delete failed';
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePublished = async (page: CmsPage) => {
    try {
      await cmsService.updatePage(page.slug, { isPublished: !page.isPublished });
      showSuccess(page.isPublished ? 'Page hidden' : 'Page published');
      fetchPages();
    } catch {
      alert('Could not update page status');
    }
  };

  // Find which system slugs are missing
  const existingSlugs = new Set(pages.map((p) => p.slug));
  const missingSlugs = SYSTEM_SLUGS.filter((s) => !existingSlugs.has(s));

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-heading tracking-tight">Pages</h1>
          <p className="text-gray-500 mt-1">
            Manage content for Contact, FAQ, Shipping, Privacy, Terms, and custom pages.
          </p>
        </div>
        <button
          onClick={() => openCreate()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:scale-[1.02] transition-all shadow-lg shadow-black/5"
        >
          <Plus className="w-4 h-4" /> New Page
        </button>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Missing system pages prompt */}
      {missingSlugs.length > 0 && !isLoading && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-semibold text-amber-800">
            ⚠ The following required pages haven't been created yet:
          </p>
          <div className="flex flex-wrap gap-2">
            {missingSlugs.map((slug) => (
              <button
                key={slug}
                onClick={() => openCreate(slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 text-amber-800 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Create /{slug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Page list */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center space-y-4">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium">No pages yet</p>
          <button onClick={() => openCreate()} className="text-primary font-bold text-sm hover:underline">
            Create your first page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {pages.map((page) => (
            <div
              key={page.slug}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                page.isPublished ? 'border-gray-100' : 'border-gray-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-heading truncate">{page.title}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-gray-400 font-mono">/{page.slug}</span>
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    page.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {page.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>

              {page.metaDescription && (
                <p className="text-xs text-gray-400 line-clamp-2 mb-4">{page.metaDescription}</p>
              )}

              <div className="flex items-center gap-2 mt-auto">
                <button
                  onClick={() => togglePublished(page)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  {page.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {page.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => openEdit(page)}
                  className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center gap-2 px-4 font-semibold text-sm"
                >
                  <Pencil className="w-4 h-4" /> Edit Content
                </button>
                {!SYSTEM_SLUGS.includes(page.slug) && (
                  <button
                    onClick={() => setDeleteTarget(page)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pt-10">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-100">
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 rounded-t-2xl">
              <h2 className="text-lg font-bold text-heading">
                {editingSlug ? `Edit /${editingSlug}` : 'New Page'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-heading transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSave} className="p-6 space-y-5">
                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Slug — only editable on create */}
                  {!editingSlug && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Page Slug *
                      </label>
                      <div className="flex items-center gap-0">
                        <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400 font-mono">
                          /
                        </span>
                        <input
                          value={form.slug}
                          onChange={(e) =>
                            setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })
                          }
                          placeholder="e.g. contact"
                          required
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <p className="text-xs text-gray-400 ml-1">
                        URL will be: <code className="bg-gray-100 px-1 rounded">/{form.slug || 'your-slug'}</code>
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Page Title *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Contact Us"
                      required
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Meta Description
                  </label>
                  <input
                    value={form.metaDescription}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    placeholder="Short description for search engines (160 chars max)"
                    maxLength={160}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Content (HTML)
                  </label>
                  {/* Rich Text Editor */}
                  <RichTextEditor
                    value={form.content}
                    onChange={(html) => setForm({ ...form, content: html })}
                    placeholder="Start writing your beautiful page content here..."
                    minHeight="350px"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm font-semibold text-gray-600">Published (visible to public)</span>
                </label>
              </form>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex gap-3 shrink-0 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl font-bold bg-primary text-on-primary disabled:opacity-60 transition-colors shadow-lg shadow-black/5"
              >
                {isSaving ? 'Saving...' : editingSlug ? 'Save Changes' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Page"
        message={`Delete "/${deleteTarget?.slug}"? This cannot be undone and the page URL will stop working.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}
