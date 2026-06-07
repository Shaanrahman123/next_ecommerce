import { SuperCategory, CategoryGroup, SubCategoryItem } from '@/types/category';

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  heroImage: string;
  heroImageUrl?: string;
  images: string[];
  imageUrls?: string[];
  superCategories: SuperCategory[] | string[];
  categories: CategoryGroup[] | string[];
  subCategories: SubCategoryItem[] | string[];
  inStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  featured: boolean;
  homeSections?: string[];
  gender: 'men' | 'women' | 'kids' | 'unisex';
  sizes?: string[];
  colors?: string[];
  colorVariants?: ColorVariant[];
  brand?: string;
  specifications?: ProductSpec[];
  ratings: number;
  reviewsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormPayload {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  heroImage: string;
  images?: string[];
  superCategories: string[];
  categories: string[];
  subCategories: string[];
  inStock: boolean;
  stockQuantity: number;
  isActive?: boolean;
  featured?: boolean;
  homeSections?: string[];
  gender: 'men' | 'women' | 'kids' | 'unisex';
  sizes?: string[];
  colors?: string[];
  colorVariants?: ColorVariant[];
  brand?: string;
  specifications?: ProductSpec[];
}

export interface ProductListMeta {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type SpecOptionsMap = Record<string, string[]>;
