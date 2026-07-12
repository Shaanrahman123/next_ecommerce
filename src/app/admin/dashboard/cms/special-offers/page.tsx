'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Plus, Pencil, Trash2, Loader2, Save, Tag, TrendingUp, Zap, Gift,
  Percent, ShoppingBag, Truck, Star, Sparkles, Package, ArrowRight,
  GripVertical, Eye, EyeOff,
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'Tag', label: 'Tag', Icon: Tag },
  { value: 'TrendingUp', label: 'Trending Up', Icon: TrendingUp },
  { value: 'Zap', label: 'Flash / Zap', Icon: Zap },
  { value: 'Gift', label: 'Gift', Icon: Gift },
  { value: 'Percent', label: 'Percent', Icon: Percent },
  { value: 'ShoppingBag', label: 'Shopping Bag', Icon: ShoppingBag },
  { value: 'Truck', label: 'Truck', Icon: Truck },
  { value: 'Star', label: 'Star', Icon: Star },
  { value: 'Sparkles', label: 'Sparkles', Icon: Sparkles },
  { value: 'Package', label: 'Package', Icon: Package },
  { value: 'ArrowRight', label: 'Arrow Right', Icon: ArrowRight },
];

interface OfferItem {
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface OffersData {
  badge: string;
  heading: string;
  headingAccent: string;
  subtitle: string;
  isActive: boolean;
  offers: OfferItem[];
}

const DEFAULT_DATA: OffersData = {
  badge: 'Limited Time',
  heading: 'Special',
  headingAccent: 'Offers',
  subtitle: "Festive deals you don't want to miss.",
  isActive: true,
  offers: [
    { icon: 'Tag', title: 'Flat 50% Off', description: 'On first purchase', link: '/products?offer=first-purchase' },
    { icon: 'TrendingUp', title: 'Buy 2 Get 1', description: 'On selected items', link: '/products?offer=buy2get1' },
    { icon: 'Zap', title: 'Flash Sale', description: 'Up to 70% off', link: '/products?offer=flash-sale' },
    { icon: 'Gift', title: 'Free Shipping', description: 'Orders above ₹999', link: '/products' },
  ],
};

const emptyOffer: OfferItem = { icon: 'Tag', title: '', description: '', link: '/products' };

export default function SpecialOffersAdminPage() {
  const [data, setData] = useState<OffersData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Offer edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [offerForm, setOfferForm] = useState<OfferItem>(emptyOffer);
  const [offerError, setOfferError] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/cms/special-offers', { credentials: 'include' });
      const json = await res.json();
      if (json?.status && json?.data) {
        setData({ ...DEFAULT_DATA, ...json.data });
      }
    } catch {
      // keep defaults
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/cms/special-offers', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.status) throw new Error(json.message || 'Save failed');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const openAddOffer = () => {
    setEditingIndex(null);
    setOfferForm({ ...emptyOffer });
    setOfferError('');
    setModalOpen(true);
  };

  const openEditOffer = (i: number) => {
    setEditingIndex(i);
    setOfferForm({ ...data.offers[i] });
    setOfferError('');
    setModalOpen(true);
  };

  const handleSaveOffer = () => {
    if (!offerForm.title.trim()) { setOfferError('Title is required'); return; }
    if (!offerForm.link.trim()) { setOfferError('Link is required'); return; }
    const newOffers = [...data.offers];
    if (editingIndex !== null) {
      newOffers[editingIndex] = offerForm;
    } else {
      newOffers.push(offerForm);
    }
    setData((prev) => ({ ...prev, offers: newOffers }));
    setModalOpen(false);
  };

  const deleteOffer = (i: number) => {
    setData((prev) => ({ ...prev, offers: prev.offers.filter((_, idx) => idx !== i) }));
  };

  const moveOffer = (i: number, dir: -1 | 1) => {
    const newOffers = [...data.offers];
    const j = i + dir;
    if (j < 0 || j >= newOffers.length) return;
    [newOffers[i], newOffers[j]] = [newOffers[j], newOffers[i]];
    setData((prev) => ({ ...prev, offers: newOffers }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-heading tracking-tight">Special Offers</h1>
          <p className="text-gray-500 mt-1">Manage the Special Offers section on the homepage</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:scale-[1.02] transition-all shadow-lg shadow-black/5 disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saveSuccess && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
          ✓ Changes saved successfully
        </div>
      )}
      {saveError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{saveError}</div>
      )}

      {/* Section Header Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-heading">Section Header</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isActive}
              onChange={(e) => setData({ ...data, isActive: e.target.checked })}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm font-semibold text-gray-600">
              {data.isActive ? <><Eye className="inline w-3.5 h-3.5 mr-1" />Visible on homepage</> : <><EyeOff className="inline w-3.5 h-3.5 mr-1" />Hidden</>}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Badge Text</label>
            <input
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              placeholder="e.g. Limited Time"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subtitle</label>
            <input
              value={data.subtitle}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              placeholder="Short subtitle below the heading"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Heading (normal)</label>
            <input
              value={data.heading}
              onChange={(e) => setData({ ...data, heading: e.target.value })}
              placeholder="e.g. Special"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Heading Accent (coloured)</label>
            <input
              value={data.headingAccent}
              onChange={(e) => setData({ ...data, headingAccent: e.target.value })}
              placeholder="e.g. Offers"
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-bold text-amber-800 outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/20"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="pt-2 border-t border-gray-50">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Preview</p>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold">{data.badge || 'Badge'}</span>
          </div>
          <h3 className="text-xl font-bold mt-1 text-heading">
            {data.heading || 'Heading'}{' '}
            <span className="text-amber-700">{data.headingAccent || 'Accent'}</span>
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{data.subtitle}</p>
        </div>
      </div>

      {/* Offer Cards */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-heading">Offer Cards <span className="text-gray-400 font-normal text-sm ml-1">({data.offers.length})</span></h2>
          <button
            onClick={openAddOffer}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Card
          </button>
        </div>

        {data.offers.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl py-12 text-center">
            <p className="text-gray-400 text-sm mb-3">No offer cards yet</p>
            <button onClick={openAddOffer} className="text-primary font-bold text-sm hover:underline">Add your first card</button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.offers.map((offer, i) => {
              const iconOption = ICON_OPTIONS.find((o) => o.value === offer.icon);
              const Icon = iconOption?.Icon ?? Tag;
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveOffer(i, -1)}
                      disabled={i === 0}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                      title="Move up"
                    >▲</button>
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    <button
                      onClick={() => moveOffer(i, 1)}
                      disabled={i === data.offers.length - 1}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                      title="Move down"
                    >▼</button>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-800" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-heading truncate">{offer.title}</p>
                    <p className="text-xs text-gray-500 truncate">{offer.description}</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{offer.link}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditOffer(i)}
                      className="p-2 rounded-lg bg-white hover:bg-gray-100 text-gray-400 hover:text-heading transition-colors border border-gray-100"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteOffer(i)}
                      className="p-2 rounded-lg bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors border border-gray-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Offer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-heading">{editingIndex !== null ? 'Edit Offer Card' : 'Add Offer Card'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-heading text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              {offerError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">{offerError}</div>
              )}

              {/* Icon Picker */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Icon</label>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {ICON_OPTIONS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      title={label}
                      onClick={() => setOfferForm({ ...offerForm, icon: value })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                        offerForm.icon === value
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-100 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${offerForm.icon === value ? 'text-primary' : 'text-gray-500'}`} />
                      <span className="text-[9px] text-gray-400 leading-none hidden sm:block">{label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Title *</label>
                <input
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="e.g. Flat 50% Off"
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <input
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  placeholder="e.g. On first purchase"
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Link URL *</label>
                <input
                  value={offerForm.link}
                  onChange={(e) => setOfferForm({ ...offerForm, link: e.target.value })}
                  placeholder="e.g. /products?offer=flash-sale"
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOffer}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity"
                >
                  {editingIndex !== null ? 'Save Changes' : 'Add Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
