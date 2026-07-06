'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Trash2,
  Palette,
  Settings,
  Image as ImageIcon,
  Tag,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSelect from '@/components/admin/categories/AdminSelect';
import ProductGalleryField from '@/components/admin/products/ProductGalleryField';
import { categoryService } from '@/services/category.service';
import { productService } from '@/services/product.service';
import { categoryFilterService } from '@/services/categoryFilter.service';
import { Product, ColorVariant } from '@/types/product';
import { SuperCategory, CategoryGroup, SubCategoryItem } from '@/types/category';
import { CategoryFilterFieldDto } from '@/types/filters';
import { HOME_PAGE_SECTIONS, HomeSectionId } from '@/constants/homeSections';
import { PRESET_COLORS, PresetColor } from '@/constants/presetColors';
import { suggestPresetForSlug, SPEC_PRESET_LABELS } from '@/constants/specPresets';
import Link from 'next/link';

const SIZE_GROUPS = [
  { id: 'alpha', label: 'Alpha Sizes (Topwear)', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] },
  { id: 'bottom', label: 'Waist Sizes (Bottomwear)', options: ['28', '30', '32', '34', '36', '38', '40'] },
  { id: 'foot', label: 'Shoe Sizes (Footwear)', options: ['6', '7', '8', '9', '10', '11', '12'] },
];

const TABS = [
  { id: 'basic', label: 'General', icon: Tag },
  { id: 'spec', label: 'Specs', icon: Settings },
  { id: 'var', label: 'Variants', icon: Palette },
  { id: 'media', label: 'Media', icon: ImageIcon },
];

function genderFromSlug(slug: string): 'men' | 'women' | 'kids' | 'unisex' {
  if (slug.includes('men')) return 'men';
  if (slug.includes('women')) return 'women';
  if (slug.includes('kid')) return 'kids';
  return 'unisex';
}

interface GalleryItem {
  id: string;
  src: string;
  publicId?: string;
  isNew?: boolean;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Category data
  const [departments, setDepartments] = useState<SuperCategory[]>([]);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [items, setItems] = useState<SubCategoryItem[]>([]);
  const [departmentId, setDepartmentId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');

  // Form fields
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    mrp: '',
    brand: '',
    stockQuantity: '0',
    returnDays: '10',
    isReturnable: true,
    featured: false,
    isActive: true,
  });

  const [filterFields, setFilterFields] = useState<CategoryFilterFieldDto[]>([]);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [specOptions, setSpecOptions] = useState<Record<string, string[]>>({});
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeGroup, setSizeGroup] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<ColorVariant[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSectionId[]>([]);

  const [heroImage, setHeroImage] = useState('');
  const [heroPreviewUrl, setHeroPreviewUrl] = useState('');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const [adding, setAdding] = useState<{ type: 'option' | 'color' | 'field'; key?: string } | null>(null);
  const [tempVal, setTempVal] = useState('');
  const [tempColor, setTempColor] = useState({ name: '', hex: '#000000' });
  const [isAddingOption, setIsAddingOption] = useState(false);

  const [presets, setPresets] = useState<string[]>([]);
  const [specCatalog, setSpecCatalog] = useState<
    Array<{ key: string; label: string; fieldUsageCount: number; optionCount: number }>
  >([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [isAddingField, setIsAddingField] = useState(false);

  const currentIdx = TABS.findIndex((t) => t.id === activeTab);
  const nextTab = () => currentIdx < TABS.length - 1 && setActiveTab(TABS[currentIdx + 1].id);
  const prevTab = () => currentIdx > 0 && setActiveTab(TABS[currentIdx - 1].id);

  const loadSpecOptions = useCallback(async (subCatId?: string) => {
    try {
      const res = await productService.getSpecOptions({ subCategory: subCatId });
      setSpecOptions(res.data || {});
    } catch {
      setSpecOptions({});
    }
  }, []);

  // Load departments on mount
  useEffect(() => {
    categoryService.listDepartments().then((res) => setDepartments(res.data || [])).catch(() => {});
  }, []);

  // Load groups when department changes
  useEffect(() => {
    if (!departmentId) {
      setGroups([]);
      return;
    }
    categoryService.listGroups({ superCategory: departmentId }).then((res) => setGroups(res.data || [])).catch(() => {});
  }, [departmentId]);

  // Load sub-categories when group changes
  useEffect(() => {
    if (!groupId) {
      setItems([]);
      return;
    }
    categoryService.listItems({ category: groupId }).then((res) => setItems(res.data || [])).catch(() => {});
  }, [groupId]);

  const reloadFilterFields = useCallback(async () => {
    if (!subCategoryId) {
      setFilterFields([]);
      return;
    }
    try {
      const res = await categoryFilterService.listForSubCategory(subCategoryId);
      setFilterFields(res.data || []);
    } catch {
      setFilterFields([]);
    }
  }, [subCategoryId]);

  const specKeys = filterFields.map((f) => f.key);
  const currentSubSlug = items.find((i) => i._id === subCategoryId)?.slug || '';
  const suggestedPreset = currentSubSlug ? suggestPresetForSlug(currentSubSlug) : null;

  // Load filter fields + spec options when sub-category changes
  useEffect(() => {
    if (!subCategoryId) {
      setFilterFields([]);
      setSpecOptions({});
      return;
    }
    reloadFilterFields();
    loadSpecOptions(subCategoryId);
  }, [subCategoryId, loadSpecOptions, reloadFilterFields]);

  useEffect(() => {
    categoryFilterService.listPresets().then((res) => setPresets(res.data || [])).catch(() => {});
    categoryFilterService.getCatalog().then((res) => setSpecCatalog(res.data || [])).catch(() => {});
  }, []);

  const toggleHomeSection = (id: HomeSectionId) => {
    setHomeSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Load product for edit mode
  useEffect(() => {
    if (mode !== 'edit' || !productId) return;

    setIsLoading(true);
    productService
      .getById(productId)
      .then((res) => {
        const p = res.data as Product;
        if (!p) return;

        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          mrp: p.originalPrice ? String(p.originalPrice) : '',
          brand: p.brand || '',
          stockQuantity: String(p.stockQuantity ?? 0),
          returnDays: String((p as Product & { returnDays?: number }).returnDays ?? 10),
          isReturnable: (p as Product & { isReturnable?: boolean }).isReturnable !== false,
          featured: p.featured,
          isActive: p.isActive,
        });

        setHomeSections((p.homeSections || []) as HomeSectionId[]);

        const sc = p.superCategories?.[0];
        const cat = p.categories?.[0];
        const sub = p.subCategories?.[0];

        if (typeof sc === 'object' && sc?._id) setDepartmentId(sc._id);
        else if (typeof sc === 'string') setDepartmentId(sc);

        if (typeof cat === 'object' && cat?._id) setGroupId(cat._id);
        else if (typeof cat === 'string') setGroupId(cat);

        if (typeof sub === 'object' && sub?._id) setSubCategoryId(sub._id);
        else if (typeof sub === 'string') setSubCategoryId(sub);

        if (p.specifications?.length) {
          const specMap: Record<string, string> = {};
          p.specifications.forEach((s) => {
            specMap[s.key] = s.value;
          });
          setSpecs(specMap);
        }

        if (p.sizes?.length) {
          setSelectedSizes(p.sizes);
          const matched = SIZE_GROUPS.find((g) => g.options.some((o) => p.sizes!.includes(o)));
          if (matched) setSizeGroup(matched.id);
        }

        if (p.colorVariants?.length) {
          setSelectedColors(p.colorVariants);
        } else if (p.colors?.length) {
          setSelectedColors(p.colors.map((c) => ({ name: c, hex: '#000000' })));
        }

        setHeroImage(p.heroImage);
        setHeroPreviewUrl(p.heroImageUrl || '');

        const galleryItems: GalleryItem[] = (p.images || []).map((id, i) => ({
          id: `existing-${i}`,
          src: p.imageUrls?.[i] || id,
          publicId: id,
        }));
        setGallery(galleryItems);
      })
      .catch((err) => setError(err.message || 'Failed to load product'))
      .finally(() => setIsLoading(false));
  }, [mode, productId]);

  const toggleSize = (group: string, val: string) => {
    if (sizeGroup !== group) {
      setSelectedSizes([val]);
      setSizeGroup(group);
    } else {
      setSelectedSizes((prev) =>
        prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
      );
    }
  };

  const handleAddOption = async () => {
    if (!tempVal.trim() || !adding?.key) return;
    setIsAddingOption(true);
    try {
      await productService.addSpecOption({
        key: adding.key,
        value: tempVal.trim(),
        subCategory: subCategoryId || undefined,
      });
      await loadSpecOptions(subCategoryId || undefined);
      setSpecs((p) => ({ ...p, [adding.key!]: tempVal.trim() }));
      setTempVal('');
      setAdding(null);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to add option';
      alert(msg);
    } finally {
      setIsAddingOption(false);
    }
  };

  const handleAddColor = () => {
    if (!tempColor.name.trim()) return;
    setSelectedColors((prev) => [...prev, { ...tempColor, name: tempColor.name.trim() }]);
    setTempColor({ name: '', hex: '#000000' });
    setAdding(null);
  };

  const handleAddSpecField = async (key?: string, label?: string) => {
    const fieldKey = (key || newFieldKey).trim();
    const fieldLabel = (label || newFieldLabel || fieldKey).trim();
    if (!subCategoryId || !fieldKey) return;

    setIsAddingField(true);
    try {
      await categoryFilterService.create({
        subCategory: subCategoryId,
        key: fieldKey,
        label: fieldLabel,
        sortOrder: filterFields.length,
      });
      setNewFieldKey('');
      setNewFieldLabel('');
      setAdding(null);
      await reloadFilterFields();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to add specification field';
      alert(msg);
    } finally {
      setIsAddingField(false);
    }
  };

  const handleDeleteSpecField = async (field: CategoryFilterFieldDto) => {
    if (!confirm(`Remove "${field.label}" from this category? Existing products keep their saved values.`)) return;
    try {
      await categoryFilterService.delete(field._id);
      setSpecs((prev) => {
        const next = { ...prev };
        delete next[field.key];
        return next;
      });
      await reloadFilterFields();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to remove field';
      alert(msg);
    }
  };

  const handleApplyPreset = async (preset?: string) => {
    const presetKey = preset || selectedPreset;
    if (!subCategoryId || !presetKey) return;
    setIsApplyingPreset(true);
    try {
      await categoryFilterService.applyPreset(subCategoryId, presetKey);
      await reloadFilterFields();
      await loadSpecOptions(subCategoryId);
      setSelectedPreset('');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to apply preset';
      alert(msg);
    } finally {
      setIsApplyingPreset(false);
    }
  };

  const isColorSelected = (name: string) =>
    selectedColors.some((c) => c.name.toLowerCase() === name.toLowerCase());

  const togglePresetColor = (preset: PresetColor) => {
    if (isColorSelected(preset.name)) {
      setSelectedColors((prev) => prev.filter((c) => c.name.toLowerCase() !== preset.name.toLowerCase()));
    } else {
      setSelectedColors((prev) => [...prev, { name: preset.name, hex: preset.hex }]);
    }
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Product title is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.price || Number(form.price) <= 0) return 'Valid price is required';
    if (!departmentId) return 'Select a department (e.g. Men)';
    if (!groupId) return 'Select a category group (e.g. Topwear)';
    if (!subCategoryId) return 'Select a sub-category (e.g. T-Shirts)';
    if (!heroImage) return 'Hero image is required';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setActiveTab('basic');
      return;
    }

    setIsSaving(true);
    setError('');

    const dept = departments.find((d) => d._id === departmentId);
    const gender = dept ? genderFromSlug(dept.slug) : 'unisex';
    const stockQty = Math.max(0, parseInt(form.stockQuantity, 10) || 0);

    const specifications = specKeys.filter((k) => specs[k]).map((k) => ({
      key: k,
      value: specs[k],
    }));

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      originalPrice: form.mrp ? Number(form.mrp) : undefined,
      heroImage,
      images: gallery.map((g) => (g.isNew ? g.src : g.publicId || g.src)),
      superCategories: [departmentId],
      categories: [groupId],
      subCategories: [subCategoryId],
      inStock: stockQty > 0,
      stockQuantity: stockQty,
      returnDays: Math.max(0, parseInt(form.returnDays, 10) || 10),
      isReturnable: form.isReturnable,
      isActive: form.isActive,
      featured: form.featured,
      homeSections,
      gender,
      sizes: selectedSizes,
      colorVariants: selectedColors,
      brand: form.brand.trim() || undefined,
      specifications,
    };

    try {
      if (mode === 'create') {
        await productService.create(payload);
      } else if (productId) {
        await productService.update(productId, payload);
      }
      router.push('/admin/dashboard/products');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to save product';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full pb-20 font-sans px-4 md:px-0">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
            {mode === 'create' ? 'Create Product' : 'Edit Product'}
          </h1>
          <p className="text-gray-500 font-semibold text-base md:text-lg mt-1">
            {mode === 'create' ? 'Define your collection' : 'Update product details'}
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 md:px-8 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-xl shadow-black/10 hover:scale-[1.02] transition-all disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'SAVING...' : mode === 'create' ? 'PUBLISH PRODUCT' : 'SAVE CHANGES'}
        </button>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <nav className="lg:col-span-3 space-y-2 sticky top-24 h-fit hidden lg:block">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center w-full px-6 py-4 rounded-xl font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-primary text-on-primary shadow-lg scale-[1.02]'
                  : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              <t.icon className="w-5 h-5 mr-3" /> {t.label}
            </button>
          ))}
        </nav>

        {/* Mobile tab bar */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase ${
                activeTab === t.id ? 'bg-primary text-on-primary' : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <main className="col-span-1 lg:col-span-9 bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm min-h-[600px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold uppercase border-b pb-4 border-gray-50">
                    General Information
                  </h2>

                  {/* Category cascade */}
                  <div className="p-6 bg-gray-50/80 rounded-xl space-y-5 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Product Classification
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
                        <AdminSelect
                          options={departments.map((d) => ({ value: d._id, label: d.name }))}
                          value={departmentId}
                          onChange={(v) => {
                            setDepartmentId(v);
                            setGroupId('');
                            setSubCategoryId('');
                          }}
                          placeholder="e.g. Men"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <AdminSelect
                          options={groups.map((g) => ({ value: g._id, label: g.name }))}
                          value={groupId}
                          onChange={(v) => {
                            setGroupId(v);
                            setSubCategoryId('');
                          }}
                          placeholder="e.g. Topwear"
                          isClearable={false}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Sub Category</label>
                        <AdminSelect
                          options={items.map((i) => ({ value: i._id, label: i.name }))}
                          value={subCategoryId}
                          onChange={setSubCategoryId}
                          placeholder="e.g. T-Shirts"
                          isClearable={false}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Title
                      </label>
                      <input
                        placeholder="e.g. Premium Slim Fit Linen Shirt"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold text-xl outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Description
                      </label>
                      <textarea
                        placeholder="Write about fabric, fit and style..."
                        rows={5}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 rounded-xl font-semibold outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                          Price (₹)
                        </label>
                        <input
                          placeholder="0.00"
                          type="number"
                          min="0"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                          MRP (₹)
                        </label>
                        <input
                          placeholder="0.00"
                          type="number"
                          min="0"
                          value={form.mrp}
                          onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold text-gray-400 outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                          Brand
                        </label>
                        <input
                          placeholder="Brand Name"
                          value={form.brand}
                          onChange={(e) => setForm({ ...form, brand: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                          Stock Quantity
                        </label>
                        <input
                          placeholder="0"
                          type="number"
                          min="0"
                          value={form.stockQuantity}
                          onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                          Return Window (Days)
                        </label>
                        <input
                          placeholder="10"
                          type="number"
                          min="0"
                          value={form.returnDays}
                          onChange={(e) => setForm({ ...form, returnDays: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-1 focus:ring-primary"
                        />
                        <p className="text-[11px] text-gray-400 ml-1">Default 10 days · set 0 for non-returnable</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isReturnable}
                          onChange={(e) => setForm({ ...form, isReturnable: e.target.checked })}
                          className="w-5 h-5 rounded accent-primary"
                        />
                        <span className="text-sm font-bold text-gray-600">Eligible for returns &amp; refunds</span>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-5">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Visibility & Homepage
                      </p>

                      <div className="flex flex-wrap gap-x-8 gap-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                            className="w-5 h-5 rounded accent-primary"
                          />
                          <span className="text-sm font-bold text-gray-600">Active (visible on store)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                            className="w-5 h-5 rounded accent-primary"
                          />
                          <span className="text-sm font-bold text-gray-600">Featured product</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {HOME_PAGE_SECTIONS.map((section) => (
                          <label
                            key={section.id}
                            title={section.description}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:border-gray-200 ${
                              homeSections.includes(section.id)
                                ? 'bg-primary/5 border-primary'
                                : 'bg-gray-50 border-gray-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={homeSections.includes(section.id)}
                              onChange={() => toggleHomeSection(section.id)}
                              className="w-5 h-5 rounded accent-primary shrink-0"
                            />
                            <span className="text-sm font-bold text-gray-700">{section.label}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 ml-1">
                        Checked sections will be saved and shown on the homepage once integrated.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'spec' && (
                <motion.div key="spec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-50">
                    <div>
                      <h2 className="text-2xl font-bold uppercase">Product Specifications</h2>
                      <p className="text-xs text-gray-400 mt-1">
                        Add custom spec sections for any product — values are saved and reused across products.
                      </p>
                    </div>
                    {subCategoryId && (
                      <Link
                        href="/admin/dashboard/products/filter-fields"
                        className="text-xs font-bold text-blue-600 hover:underline uppercase shrink-0"
                      >
                        Advanced field manager →
                      </Link>
                    )}
                  </div>

                  {!subCategoryId && (
                    <p className="text-sm text-amber-600 font-semibold bg-amber-50 p-4 rounded-xl">
                      Select a sub-category in the General tab first — then you can add specification sections here.
                    </p>
                  )}

                  {subCategoryId && (
                    <div className="space-y-4">
                      {/* Quick preset */}
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Quick setup
                          </p>
                        </div>
                        {suggestedPreset && filterFields.length === 0 && (
                          <button
                            type="button"
                            onClick={() => handleApplyPreset(suggestedPreset)}
                            disabled={isApplyingPreset}
                            className="w-full sm:w-auto px-5 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-wide hover:opacity-90 disabled:opacity-60"
                          >
                            {isApplyingPreset
                              ? 'Applying...'
                              : `Apply suggested: ${SPEC_PRESET_LABELS[suggestedPreset] || suggestedPreset}`}
                          </button>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <select
                            value={selectedPreset}
                            onChange={(e) => setSelectedPreset(e.target.value)}
                            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="">Choose a preset template…</option>
                            {presets.map((p) => (
                              <option key={p} value={p}>
                                {SPEC_PRESET_LABELS[p] || p}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleApplyPreset()}
                            disabled={!selectedPreset || isApplyingPreset}
                            className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-gray-100 disabled:opacity-50"
                          >
                            Apply preset
                          </button>
                        </div>
                      </div>

                      {/* Add new field */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Add specification section
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            placeholder="Field name (e.g. Movement, Fabric)"
                            value={newFieldKey}
                            onChange={(e) => {
                              setNewFieldKey(e.target.value);
                              if (!newFieldLabel) setNewFieldLabel(e.target.value);
                            }}
                            className="px-4 py-3 bg-gray-50 rounded-xl font-semibold text-sm outline-none focus:ring-1 focus:ring-primary"
                          />
                          <input
                            placeholder="Display label (optional)"
                            value={newFieldLabel}
                            onChange={(e) => setNewFieldLabel(e.target.value)}
                            className="px-4 py-3 bg-gray-50 rounded-xl font-semibold text-sm outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddSpecField()}
                          disabled={!newFieldKey.trim() || isAddingField}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-wide disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                          {isAddingField ? 'Adding…' : 'Add section'}
                        </button>

                        {specCatalog.length > 0 && (
                          <div className="pt-3 border-t border-gray-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                              Reuse from catalog
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {specCatalog
                                .filter((c) => !filterFields.some((f) => f.key.toLowerCase() === c.key.toLowerCase()))
                                .slice(0, 12)
                                .map((c) => (
                                  <button
                                    key={c.key}
                                    type="button"
                                    onClick={() => handleAddSpecField(c.key, c.label)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-100 hover:bg-amber-100 transition-colors"
                                  >
                                    + {c.label}
                                    {c.optionCount > 0 && (
                                      <span className="text-amber-600/60 ml-1">({c.optionCount})</span>
                                    )}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {subCategoryId && filterFields.length === 0 && (
                    <div className="text-center py-10 px-6 border-2 border-dashed border-gray-200 rounded-2xl">
                      <p className="text-sm font-semibold text-gray-500 mb-1">No specification sections yet</p>
                      <p className="text-xs text-gray-400 mb-4">
                        For a watch, add sections like Movement, Strap Material, Dial Color — not Fabric or Pattern.
                      </p>
                      {suggestedPreset && (
                        <button
                          type="button"
                          onClick={() => handleApplyPreset(suggestedPreset)}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Apply {SPEC_PRESET_LABELS[suggestedPreset] || suggestedPreset} preset →
                        </button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-8">
                    {filterFields.map((field) => (
                      <div
                        key={field._id}
                        className="space-y-3 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm"
                      >
                        <div className="flex justify-between items-center gap-3">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {field.label}
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setAdding({ type: 'option', key: field.key })}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              + Add value
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSpecField(field)}
                              className="text-xs font-bold text-red-500 hover:underline inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(specOptions[field.key] || []).length === 0 ? (
                            <p className="text-xs text-gray-400 italic py-2">
                              No values yet — click &quot;+ Add value&quot; to create reusable options
                            </p>
                          ) : (
                            (specOptions[field.key] || []).map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSpecs({ ...specs, [field.key]: opt })}
                                className={`px-5 py-3 rounded-xl text-xs font-bold border transition-all ${
                                  specs[field.key] === opt
                                    ? 'bg-primary text-on-primary border-primary'
                                    : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200'
                                }`}
                              >
                                {opt}
                              </button>
                            ))
                          )}
                        </div>
                        {specs[field.key] && (
                          <p className="text-[10px] text-green-600 font-semibold">
                            Selected: {specs[field.key]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'var' && (
                <motion.div key="var" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  <h2 className="text-2xl font-bold uppercase border-b pb-4 border-gray-50">Variants</h2>

                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Size Selection (choose one scale)
                      </label>
                      {sizeGroup && (
                        <button
                          type="button"
                          onClick={() => {
                            setSizeGroup(null);
                            setSelectedSizes([]);
                          }}
                          className="text-xs font-bold text-red-500 hover:underline"
                        >
                          RESET SIZES
                        </button>
                      )}
                    </div>
                    <div className="space-y-10">
                      {SIZE_GROUPS.map((group) => (
                        <div
                          key={group.id}
                          className={`space-y-4 transition-opacity ${
                            sizeGroup && sizeGroup !== group.id ? 'opacity-20 pointer-events-none' : 'opacity-100'
                          }`}
                        >
                          <h3 className="text-xs font-bold text-heading/40 uppercase bg-gray-50 py-1 px-3 rounded-full w-fit">
                            {group.label}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {group.options.map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => toggleSize(group.id, sz)}
                                className={`px-6 py-4 rounded-xl font-bold text-sm border transition-all ${
                                  selectedSizes.includes(sz)
                                    ? 'bg-primary text-on-primary border-primary scale-105 shadow-lg'
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-gray-50">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Color Palette
                      </label>
                      <button
                        type="button"
                        onClick={() => setAdding({ type: 'color' })}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        + ADD CUSTOM COLOR
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                        Quick Pick — Famous Colors
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                        {PRESET_COLORS.map((preset) => {
                          const selected = isColorSelected(preset.name);
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => togglePresetColor(preset)}
                              title={preset.name}
                              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all hover:scale-105 ${
                                selected
                                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                                  : 'border-gray-100 bg-white hover:border-gray-200'
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full shadow-inner shrink-0 ${
                                  preset.border ? 'border border-gray-200' : ''
                                } ${preset.multi ? 'overflow-hidden' : ''}`}
                                style={
                                  preset.multi
                                    ? undefined
                                    : { backgroundColor: preset.hex }
                                }
                              >
                                {preset.multi && (
                                  <div className="w-full h-full grid grid-cols-2 grid-rows-2">
                                    <div className="bg-green-500" />
                                    <div className="bg-yellow-400" />
                                    <div className="bg-pink-500" />
                                    <div className="bg-orange-500" />
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-[9px] font-bold text-center leading-tight line-clamp-2 ${
                                  selected ? 'text-primary' : 'text-gray-500'
                                }`}
                              >
                                {preset.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedColors.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-gray-50">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                          Selected ({selectedColors.length})
                        </p>
                        <div className="flex flex-wrap gap-4 items-start">
                          {selectedColors.map((c, i) => (
                            <div key={`${c.name}-${i}`} className="flex flex-col items-center gap-2 group relative">
                              <div
                                className="w-14 h-14 rounded-xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: c.hex }}
                              >
                                <button
                                  type="button"
                                  onClick={() => setSelectedColors(selectedColors.filter((_, idx) => idx !== i))}
                                  className="opacity-0 group-hover:opacity-100 bg-black/20 backdrop-blur-md p-2 rounded-lg text-white transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter max-w-[72px] text-center truncate">
                                {c.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'media' && (
                <motion.div key="media" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-2xl font-bold uppercase border-b pb-4 border-gray-50">Media Assets</h2>
                  <ProductGalleryField
                    heroImage={heroImage}
                    heroPreviewUrl={heroPreviewUrl}
                    gallery={gallery}
                    onHeroChange={(base64) => {
                      setHeroImage(base64);
                      setHeroPreviewUrl(base64);
                    }}
                    onHeroClear={() => {
                      setHeroImage('');
                      setHeroPreviewUrl('');
                    }}
                    onGalleryAdd={(base64) => {
                      setGallery((prev) => [
                        ...prev,
                        { id: `new-${Date.now()}`, src: base64, isNew: true },
                      ]);
                    }}
                    onGalleryRemove={(id) => setGallery((prev) => prev.filter((g) => g.id !== id))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="mt-12 flex justify-between items-center pt-8 border-t border-gray-50">
            <button
              type="button"
              onClick={prevTab}
              disabled={currentIdx === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                currentIdx === 0 ? 'opacity-0' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> PREVIOUS
            </button>
            {currentIdx < TABS.length - 1 ? (
              <button
                type="button"
                onClick={nextTab}
                className="flex items-center gap-2 px-10 py-4 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-xl shadow-black/10 hover:scale-[1.05] active:scale-95 transition-all"
              >
                NEXT STEP <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-12 py-4 bg-green-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-green-600/20 hover:scale-[1.05] transition-all uppercase tracking-widest disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Finalize & Save'}
              </button>
            )}
          </footer>
        </main>
      </div>

      {/* Add option / color modal */}
      <AnimatePresence>
        {adding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdding(null)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm relative z-10 border border-gray-50"
            >
              {adding.type === 'color' ? (
                <div className="space-y-6">
                  <h3 className="font-bold uppercase tracking-widest text-xs">Custom Color Variant</h3>
                  <div className="space-y-4">
                    <input
                      placeholder="Color Name (e.g. Navy Blue)"
                      className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold"
                      value={tempColor.name}
                      onChange={(e) => setTempColor({ ...tempColor, name: e.target.value })}
                    />
                    <div className="flex gap-4 items-center">
                      <input
                        type="color"
                        className="w-14 h-14 rounded-lg cursor-pointer bg-transparent border-none"
                        value={tempColor.hex}
                        onChange={(e) => setTempColor({ ...tempColor, hex: e.target.value })}
                      />
                      <input
                        className="flex-1 p-4 bg-gray-50 rounded-xl outline-none font-bold uppercase"
                        value={tempColor.hex}
                        readOnly
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="w-full p-4 bg-primary text-on-primary rounded-xl font-bold shadow-xl"
                  >
                    ADD TO PALETTE
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-bold uppercase tracking-widest text-xs">
                    Add Option to {adding.key}
                  </h3>
                  <input
                    autoFocus
                    placeholder="New Value..."
                    className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-lg ring-1 ring-gray-100 focus:ring-primary"
                    value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAdding(null)}
                      className="flex-1 p-4 font-bold text-gray-400 bg-gray-50 rounded-xl"
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      disabled={isAddingOption}
                      className="flex-1 p-4 font-bold text-white bg-primary rounded-xl disabled:opacity-60"
                    >
                      {isAddingOption ? 'Saving...' : 'CONFIRM'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
