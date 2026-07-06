import { cache } from 'react';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import '@/models/SuperCategory';
import '@/models/Category';
import '@/models/SubCategory';
import { serializeProduct } from '@/lib/productSerializer';
import {
  toStorefrontProductDetail,
  toStorefrontProduct,
} from '@/lib/storefrontProductMapper';
import { StorefrontProductDetail } from '@/types/storefrontProduct';
import { Product as StorefrontProduct } from '@/types';

export const getProductDetail = cache(async (id: string): Promise<StorefrontProductDetail | null> => {
  await dbConnect();

  const product = await Product.findOne({ _id: id, isActive: true })
    .populate('superCategories')
    .populate('categories')
    .populate('subCategories')
    .lean();

  if (!product) return null;

  return toStorefrontProductDetail(
    serializeProduct(product as unknown as Record<string, unknown>)
  );
});

export async function getSimilarProducts(
  currentProductId: string,
  categoryIds: string[],
  subCategoryIds: string[],
  limit = 4
): Promise<StorefrontProduct[]> {
  await dbConnect();

  const orConditions: Record<string, unknown>[] = [];
  if (subCategoryIds.length) orConditions.push({ subCategories: { $in: subCategoryIds } });
  if (categoryIds.length) orConditions.push({ categories: { $in: categoryIds } });

  if (!orConditions.length) return [];

  const products = await Product.find({
    _id: { $ne: currentProductId },
    isActive: true,
    $or: orConditions,
  })
    .sort({ featured: -1, ratings: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  return products.map((p) =>
    toStorefrontProduct(serializeProduct(p as unknown as Record<string, unknown>))
  );
}
