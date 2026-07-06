'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  GripVertical,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import AdminSelect from '@/components/admin/categories/AdminSelect';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { categoryService } from '@/services/category.service';
import { categoryFilterService } from '@/services/categoryFilter.service';
import { SuperCategory, CategoryGroup, SubCategoryItem } from '@/types/category';
import { CategoryFilterFieldDto } from '@/types/filters';

export default function FilterFieldsPage() {
  const [departments, setDepartments] = useState<SuperCategory[]>([]);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [items, setItems] = useState<SubCategoryItem[]>([]);
  const [departmentId, setDepartmentId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');

  const [fields, setFields] = useState<CategoryFilterFieldDto[]>([]);
  const [presets, setPresets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CategoryFilterFieldDto | null>(null);

  const [newKey, setNewKey] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');

  useEffect(() => {
    categoryService.listDepartments().then((res) => setDepartments(res.data || [])).catch(() => {});
    categoryFilterService.listPresets().then((res) => setPresets(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!departmentId) {
      setGroups([]);
      return;
    }
    categoryService.listGroups({ superCategory: departmentId }).then((res) => setGroups(res.data || [])).catch(() => {});
  }, [departmentId]);

  useEffect(() => {
    if (!groupId) {
      setItems([]);
      return;
    }
    categoryService.listItems({ category: groupId }).then((res) => setItems(res.data || [])).catch(() => {});
  }, [groupId]);

  const fetchFields = useCallback(async () => {
    if (!subCategoryId) {
      setFields([]);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await categoryFilterService.adminList(subCategoryId);
      setFields(res.data || []);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to load';
      setError(msg);
      setFields([]);
    } finally {
      setIsLoading(false);
    }
  }, [subCategoryId]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleAddField = async () => {
    if (!subCategoryId || !newKey.trim() || !newLabel.trim()) return;
    setIsSaving(true);
    try {
      await categoryFilterService.create({
        subCategory: subCategoryId,
        key: newKey.trim(),
        label: newLabel.trim(),
        sortOrder: fields.length,
      });
      setNewKey('');
      setNewLabel('');
      await fetchFields();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to add';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyPreset = async () => {
    if (!subCategoryId || !selectedPreset) return;
    setIsSaving(true);
    try {
      await categoryFilterService.applyPreset(subCategoryId, selectedPreset);
      await fetchFields();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Failed to apply preset';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (field: CategoryFilterFieldDto) => {
    try {
      await categoryFilterService.update(field._id, { isActive: !field.isActive });
      await fetchFields();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Update failed';
      alert(msg);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= fields.length) return;
    const current = fields[index];
    const swap = fields[target];
    try {
      await Promise.all([
        categoryFilterService.update(current._id, { sortOrder: target }),
        categoryFilterService.update(swap._id, { sortOrder: index }),
      ]);
      await fetchFields();
    } catch {
      alert('Failed to reorder');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await categoryFilterService.delete(deleteTarget._id);
      setDeleteTarget(null);
      await fetchFields();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Delete failed';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedItem = items.find((i) => i._id === subCategoryId);

  return (
    <div className="w-full pb-20 font-sans">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Filter className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Filter Fields</h1>
            <p className="text-gray-500 font-semibold mt-1">
              Define which filters appear on the storefront for each sub-category
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Category</h2>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Department</p>
              <AdminSelect
                value={departmentId}
                onChange={(v) => {
                  setDepartmentId(v);
                  setGroupId('');
                  setSubCategoryId('');
                }}
                options={departments.map((d) => ({ value: d._id, label: d.name }))}
                placeholder="Select department"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Category Group</p>
              <AdminSelect
                value={groupId}
                onChange={(v) => {
                  setGroupId(v);
                  setSubCategoryId('');
                }}
                options={groups.map((g) => ({ value: g._id, label: g.name }))}
                placeholder="Select group"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Sub-Category</p>
              <AdminSelect
                value={subCategoryId}
                onChange={setSubCategoryId}
                options={items.map((i) => ({ value: i._id, label: i.name }))}
                placeholder="Select sub-category"
              />
            </div>
          </div>

          {subCategoryId && (
            <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-widest">Quick Presets</h2>
              </div>
              <p className="text-xs text-gray-500">
                One-click setup for {selectedItem?.name || 'this category'} — adds standard filter fields used by major e-commerce sites.
              </p>
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold bg-white"
              >
                <option value="">Choose a preset...</option>
                {presets.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
              <button
                onClick={handleApplyPreset}
                disabled={!selectedPreset || isSaving}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                {isSaving ? 'Applying...' : 'Apply Preset'}
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!subCategoryId ? (
            <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold">Select a sub-category to manage its filter fields</p>
              <p className="text-sm text-gray-400 mt-2">
                e.g. Men → Topwear → T-Shirts will show Sleeve Type, Fabric, Fit Type filters on the listing page
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Add Custom Field
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Key (e.g. Sleeve Type)"
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                  <input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Display label"
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
                  />
                </div>
                <button
                  onClick={handleAddField}
                  disabled={isSaving || !newKey.trim() || !newLabel.trim()}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest">
                    {selectedItem?.name} — {fields.length} fields
                  </h2>
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                </div>

                {error && <p className="px-6 py-3 text-sm text-red-600 bg-red-50">{error}</p>}

                {!isLoading && fields.length === 0 && (
                  <div className="p-12 text-center text-gray-500">
                    <p className="font-semibold mb-2">No filter fields yet</p>
                    <p className="text-sm">Apply a preset or add custom fields above</p>
                  </div>
                )}

                <div className="divide-y divide-gray-50">
                  {fields.map((field, index) => (
                    <div
                      key={field._id}
                      className={`flex items-center gap-4 px-6 py-4 ${!field.isActive ? 'opacity-50' : ''}`}
                    >
                      <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900">{field.label}</p>
                        <p className="text-xs text-gray-400 font-mono">{field.key}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === fields.length - 1}
                          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(field)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title={field.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {field.isActive ? (
                            <Eye className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(field)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Filter Field"
        message={`Remove "${deleteTarget?.label}"? Products using this spec will keep their data, but the filter won't appear on the storefront.`}
        confirmLabel={isSaving ? 'Deleting...' : 'Delete'}
        variant="danger"
        isLoading={isSaving}
      />
    </div>
  );
}
