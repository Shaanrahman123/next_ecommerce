import { Product as StorefrontProduct } from '@/types';

export interface StorefrontProductDetail extends StorefrontProduct {
  slug: string;
  brand?: string;
  material?: string;
  season?: string;
  stockQuantity: number;
  soldQuantity?: number;
  returnDays: number;
  isReturnable: boolean;
  specifications: { key: string; value: string }[];
  colorVariants: { name: string; hex: string }[];
  categoryLabel: string;
  breadcrumbs: { label: string; href: string }[];
  departmentSlug?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  categoryIds: string[];
  subCategoryIds: string[];
}
