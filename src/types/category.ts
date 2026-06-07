import { ApiResponse } from '@/types/api';

export interface CategoryBase {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SuperCategory extends CategoryBase {}

export interface CategoryGroup extends CategoryBase {
  superCategories: SuperCategory[] | string[];
}

export interface SubCategoryItem extends CategoryBase {
  category: CategoryGroup | string;
}

export interface CategoryTreeItem {
  name: string;
  slug: string;
  image: string;
}

export interface CategoryTreeSection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  imageUrl: string;
  basePath: string;
  items: Array<{
    id: string;
    name: string;
    slug: string;
    image?: string;
    imageUrl: string;
  }>;
}

export interface CategoryTreeDepartment {
  id: string;
  label: string;
  slug: string;
  description?: string;
  image?: string;
  imageUrl: string;
  basePath: string;
  sections: CategoryTreeSection[];
}

export interface CategoryFormPayload {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface DepartmentFormPayload extends CategoryFormPayload {}

export interface GroupFormPayload extends CategoryFormPayload {
  superCategories: string[];
}

export interface ItemFormPayload extends CategoryFormPayload {
  category: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: {
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
