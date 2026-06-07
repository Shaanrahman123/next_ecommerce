'use client';

import { useCallback, useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Search, Layers, FolderTree, Tag } from 'lucide-react';
import CategoryFormModal, { CategoryFormValues, CategoryLevel } from '@/components/admin/categories/CategoryFormModal';
import AdminSelect from '@/components/admin/categories/AdminSelect';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { categoryService, getAuthErrorMessage } from '@/services/category.service';
import { resolveCategoryImageUrl, CATEGORY_IMAGE_PLACEHOLDER } from '@/utils/categoryImage';
import {
  CategoryGroup,
  SubCategoryItem,
  SuperCategory,
} from '@/types/category';

type TabId = 'departments' | 'groups' | 'items';

const TABS: { id: TabId; label: string; icon: typeof Layers }[] = [
  { id: 'departments', label: 'Departments', icon: FolderTree },
  { id: 'groups', label: 'Category Groups', icon: Layers },
  { id: 'items', label: 'Sub Categories', icon: Tag },
];

function CategoriesContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>('departments');
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterGroup, setFilterGroup] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab') as TabId;
    if (tab && TABS.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [departments, setDepartments] = useState<SuperCategory[]>([]);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [items, setItems] = useState<SubCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalLevel, setModalLevel] = useState<CategoryLevel>('department');
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    level: CategoryLevel;
    id: string;
    name: string;
  } | null>(null);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [deptRes, groupRes, itemRes] = await Promise.all([
        categoryService.listDepartments(true),
        categoryService.listGroups({ all: true }),
        categoryService.listItems({ all: true }),
      ]);
      setDepartments(deptRes.data || []);
      setGroups(groupRes.data || []);
      setItems(itemRes.data || []);
    } catch (err) {
      setToast(getAuthErrorMessage(err, 'Failed to load categories'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const departmentOptions = useMemo(
    () => departments.map((d) => ({ id: d._id, name: d.name })),
    [departments]
  );

  const modalGroupOptions = useMemo(
    () => groups.map((g) => ({ id: g._id, name: g.name })),
    [groups]
  );

  const filterGroupOptions = useMemo(() => {
    let list = groups;
    if (filterDept) {
      list = list.filter((g) =>
        (g.superCategories as SuperCategory[]).some((s) =>
          typeof s === 'object' ? s._id === filterDept : s === filterDept
        )
      );
    }
    return list.map((g) => ({ id: g._id, name: g.name }));
  }, [groups, filterDept]);

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGroups = groups.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    if (!filterDept) return matchSearch;
    const parents = g.superCategories as SuperCategory[];
    const matchDept = parents.some((s) => (typeof s === 'object' ? s._id : s) === filterDept);
    return matchSearch && matchDept;
  });

  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const cat = item.category as CategoryGroup;
    const catId = typeof cat === 'object' ? cat._id : item.category;
    if (filterGroup) return matchSearch && catId === filterGroup;
    if (filterDept) {
      const group = groups.find((g) => g._id === catId);
      if (!group) return false;
      const parents = group.superCategories as SuperCategory[];
      return matchSearch && parents.some((s) => (typeof s === 'object' ? s._id : s) === filterDept);
    }
    return matchSearch;
  });

  const openCreate = (level: CategoryLevel) => {
    setModalLevel(level);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (level: CategoryLevel, record: Record<string, unknown>) => {
    setModalLevel(level);
    const superCats =
      level === 'group' && Array.isArray(record.superCategories)
        ? (record.superCategories as SuperCategory[]).map((s) =>
            typeof s === 'object' ? s._id : String(s)
          )
        : [];

    const categoryId =
      level === 'item' && record.category
        ? typeof record.category === 'object'
          ? (record.category as CategoryGroup)._id
          : String(record.category)
        : '';

    setEditing({
      _id: record._id as string,
      name: record.name,
      slug: record.slug,
      description: record.description || '',
      isActive: record.isActive ?? true,
      sortOrder: record.sortOrder ?? 0,
      image: (record.image as string) || '',
      imageUrl: record.imageUrl as string | undefined,
      superCategories: superCats,
      category: categoryId,
    });
    setModalOpen(true);
  };

  const handleSave = async (values: CategoryFormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        isActive: values.isActive,
        sortOrder: values.sortOrder,
        ...(values.image ? { image: values.image } : {}),
      };

      if (modalLevel === 'department') {
        if (editing?._id) {
          await categoryService.updateDepartment(String(editing._id), payload);
        } else {
          await categoryService.createDepartment(payload);
        }
      } else if (modalLevel === 'group') {
        const groupPayload = { ...payload, superCategories: values.superCategories };
        if (editing?._id) {
          await categoryService.updateGroup(String(editing._id), groupPayload);
        } else {
          await categoryService.createGroup(groupPayload);
        }
      } else {
        const itemPayload = { ...payload, category: values.category };
        if (editing?._id) {
          await categoryService.updateItem(String(editing._id), itemPayload);
        } else {
          await categoryService.createItem(itemPayload);
        }
      }

      setModalOpen(false);
      setToast('Saved successfully');
      await loadAll();
    } catch (err) {
      throw new Error(getAuthErrorMessage(err, 'Failed to save'));
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (level: CategoryLevel, id: string, name: string) => {
    setPendingDelete({ level, id, name });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setConfirmLoading(true);
    try {
      const { level, id } = pendingDelete;
      if (level === 'department') await categoryService.deleteDepartment(id);
      else if (level === 'group') await categoryService.deleteGroup(id);
      else await categoryService.deleteItem(id);
      setToast('Deleted successfully');
      setConfirmOpen(false);
      setPendingDelete(null);
      await loadAll();
    } catch (err) {
      setToast(getAuthErrorMessage(err, 'Failed to delete'));
    } finally {
      setConfirmLoading(false);
    }
  };

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (activeTab === 'departments') {
      return (
        <TableShell
          headers={['Image', 'Name', 'Slug', 'Order', 'Status', 'Actions']}
          rows={filteredDepartments}
          empty="No departments yet. Add Men, Women, or Kids to get started."
          renderRow={(dept) => (
            <tr key={dept._id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4">
                <Thumb image={dept.image} imageUrl={dept.imageUrl} alt={dept.name} />
              </td>
              <td className="px-6 py-4 font-medium text-heading">{dept.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">/{dept.slug}</td>
              <td className="px-6 py-4 text-sm">{dept.sortOrder ?? 0}</td>
              <td className="px-6 py-4"><StatusBadge active={dept.isActive} /></td>
              <td className="px-6 py-4 text-right">
                <ActionButtons
                  onEdit={() => openEdit('department', dept as unknown as Record<string, unknown>)}
                  onDelete={() => requestDelete('department', dept._id, dept.name)}
                />
              </td>
            </tr>
          )}
        />
      );
    }

    if (activeTab === 'groups') {
      return (
        <TableShell
          headers={['Image', 'Name', 'Departments', 'Slug', 'Order', 'Status', 'Actions']}
          rows={filteredGroups}
          empty="No category groups yet. Add Topwear, Bottomwear, Footwear, etc."
          renderRow={(group) => (
            <tr key={group._id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4">
                <Thumb image={group.image} imageUrl={group.imageUrl} alt={group.name} />
              </td>
              <td className="px-6 py-4 font-medium text-heading">{group.name}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {(group.superCategories as SuperCategory[]).map((s) => (
                    <span key={typeof s === 'object' ? s._id : s} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                      {typeof s === 'object' ? s.name : s}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">/{group.slug}</td>
              <td className="px-6 py-4 text-sm">{group.sortOrder ?? 0}</td>
              <td className="px-6 py-4"><StatusBadge active={group.isActive} /></td>
              <td className="px-6 py-4 text-right">
                <ActionButtons
                  onEdit={() => openEdit('group', { ...group, _id: group._id } as unknown as Record<string, unknown>)}
                  onDelete={() => requestDelete('group', group._id, group.name)}
                />
              </td>
            </tr>
          )}
        />
      );
    }

    return (
      <TableShell
        headers={['Image', 'Name', 'Group', 'Slug', 'Order', 'Status', 'Actions']}
        rows={filteredItems}
        empty="No sub categories yet. Add Shirts, Jeans, Watches, etc."
        renderRow={(item) => {
          const cat = item.category as CategoryGroup;
          return (
            <tr key={item._id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4">
                <Thumb image={item.image} imageUrl={item.imageUrl} alt={item.name} />
              </td>
              <td className="px-6 py-4 font-medium text-heading">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {typeof cat === 'object' ? cat.name : '—'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">/{item.slug}</td>
              <td className="px-6 py-4 text-sm">{item.sortOrder ?? 0}</td>
              <td className="px-6 py-4"><StatusBadge active={item.isActive} /></td>
              <td className="px-6 py-4 text-right">
                <ActionButtons
                  onEdit={() => openEdit('item', { ...item, _id: item._id } as unknown as Record<string, unknown>)}
                  onDelete={() => requestDelete('item', item._id, item.name)}
                />
              </td>
            </tr>
          );
        }}
      />
    );
  };

  const addLabel =
    activeTab === 'departments' ? 'Add Department' : activeTab === 'groups' ? 'Add Group' : 'Add Sub Category';

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-[300] bg-primary text-on-primary px-5 py-3 rounded-xl shadow-lg text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Category Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage departments (Men/Women), groups (Topwear/Bottomwear), and items (Shirts/Jeans)
          </p>
        </div>
        <button
          onClick={() => openCreate(activeTab === 'departments' ? 'department' : activeTab === 'groups' ? 'group' : 'item')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-black/5"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none w-56"
            />
          </div>
          {(activeTab === 'groups' || activeTab === 'items') && (
            <AdminSelect
              options={departments.map((d) => ({ value: d._id, label: d.name }))}
              value={filterDept}
              onChange={(value) => { setFilterDept(value); setFilterGroup(''); }}
              placeholder="All Departments"
            />
          )}
          {activeTab === 'items' && (
            <AdminSelect
              options={filterGroupOptions.map((g) => ({ value: g.id, label: g.name }))}
              value={filterGroup}
              onChange={setFilterGroup}
              placeholder="All Groups"
            />
          )}
        </div>
        {renderTable()}
      </div>

      <CategoryFormModal
        isOpen={modalOpen}
        level={modalLevel}
        initial={editing || undefined}
        departmentOptions={departmentOptions}
        groupOptions={modalGroupOptions}
        isSaving={isSaving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete item?"
        message={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={confirmLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (confirmLoading) return;
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function Thumb({ image, imageUrl, alt }: { image?: string; imageUrl?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const src = failed ? CATEGORY_IMAGE_PLACEHOLDER : resolveCategoryImageUrl(image, imageUrl);

  return (
    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
          N/A
        </div>
      )}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
    }`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button type="button" onClick={onEdit} className="p-2 rounded-lg text-gray-500 hover:text-heading hover:bg-gray-100 transition-colors">
        <Pencil className="w-4 h-4" />
      </button>
      <button type="button" onClick={onDelete} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function TableShell<T>({
  headers,
  rows,
  empty,
  renderRow,
}: {
  headers: string[];
  rows: T[];
  empty: string;
  renderRow: (row: T) => React.ReactNode;
}) {
  if (rows.length === 0) {
    return <p className="text-center text-gray-400 py-16 text-sm">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-white">
            {headers.map((h) => (
              <th key={h} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

export default function CategoriesAdminPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
