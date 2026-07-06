'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUploadField from './ImageUploadField';
import AdminSelect from './AdminSelect';
import { slugify } from '@/lib/slugify';

export type CategoryLevel = 'department' | 'group' | 'item';

export interface SelectOption {
  id: string;
  name: string;
}

export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  image: string;
  superCategories: string[];
  category: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  level: CategoryLevel;
  initial?: Partial<CategoryFormValues> & { imageUrl?: string };
  departmentOptions?: SelectOption[];
  groupOptions?: SelectOption[];
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}

const defaultValues: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
  isActive: true,
  sortOrder: 0,
  image: '',
  superCategories: [],
  category: '',
};

const levelLabels: Record<CategoryLevel, string> = {
  department: 'Department',
  group: 'Category Group',
  item: 'Sub Category Item',
};

export default function CategoryFormModal({
  isOpen,
  level,
  initial,
  departmentOptions = [],
  groupOptions = [],
  isSaving,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [form, setForm] = useState<CategoryFormValues>(defaultValues);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...defaultValues,
        ...initial,
        superCategories: initial?.superCategories || [],
        category: initial?.category || '',
      });
      setError('');
    }
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    if (level === 'group' && form.superCategories.length === 0) {
      setError('Select at least one department');
      return;
    }
    if (level === 'item' && !form.category) {
      setError('Select a category group');
      return;
    }
    if (level === 'department' && !form.image && !initial?.imageUrl && !initial?.image) {
      setError('Department image is required (1 image only)');
      return;
    }

    try {
      await onSubmit({
        ...form,
        slug: form.slug || slugify(form.name),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const toggleDepartment = (id: string) => {
    setForm((prev) => ({
      ...prev,
      superCategories: prev.superCategories.includes(id)
        ? prev.superCategories.filter((d) => d !== id)
        : [...prev.superCategories, id],
    }));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-heading">
            {initial?.name ? 'Edit' : 'Add'} {levelLabels[level]}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-heading text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
            placeholder={level === 'department' ? 'Men' : level === 'group' ? 'Topwear' : 'Shirts'}
            required
          />

          <Input
            label="Slug (URL)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            placeholder="auto-generated-from-name"
          />

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="Optional description"
            />
          </div>

          {level === 'group' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Departments (select one or more)
              </label>
              <div className="flex flex-wrap gap-2">
                {departmentOptions.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => toggleDepartment(dept.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      form.superCategories.includes(dept.id)
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 ml-1">
                One category group can belong to multiple departments (e.g. Bottomwear for Men & Women).
                If the name already exists, saving will link it to the newly selected departments.
              </p>
            </div>
          )}

          {level === 'item' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category Group</label>
              <AdminSelect
                options={groupOptions.map((g) => ({ value: g.id, label: g.name }))}
                value={form.category}
                onChange={(value) => setForm({ ...form, category: value })}
                placeholder="Select group..."
                isClearable={false}
              />
            </div>
          )}

          {level === 'department' && (
            <ImageUploadField
              label="Department Image (required, 1 image only)"
              previewUrl={initial?.imageUrl}
              value={form.image}
              onChange={(base64) => setForm({ ...form, image: base64 })}
              onClear={() => setForm({ ...form, image: '' })}
            />
          )}

          {level !== 'department' && (
            <ImageUploadField
              previewUrl={initial?.imageUrl}
              value={form.image}
              onChange={(base64) => setForm({ ...form, image: base64 })}
              onClear={() => setForm({ ...form, image: '' })}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sort Order"
              type="number"
              value={String(form.sortOrder)}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
            />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm font-semibold text-gray-600">Active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" fullWidth onClick={onClose} className="bg-gray-100 text-gray-600 hover:bg-gray-200">
              Cancel
            </Button>
            <Button type="submit" fullWidth isLoading={isSaving} className="bg-primary text-on-primary">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
