export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range' | 'color';
  key?: string;
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export interface CategoryContextDto {
  departmentId?: string;
  departmentSlug?: string;
  departmentName?: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  subCategoryId?: string;
  subCategorySlug?: string;
  subCategoryName?: string;
  pageTitle: string;
  breadcrumb: { label: string; href: string }[];
  linkedDepartments?: { id: string; slug: string; name: string }[];
}

export interface CategoryFilterFieldDto {
  _id: string;
  subCategory: string;
  key: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}
