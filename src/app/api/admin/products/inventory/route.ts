import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { serializeProductList } from '@/lib/productSerializer';
import {
  LOW_STOCK_THRESHOLD,
  buildStockFilterQuery,
  type StockFilter,
} from '@/lib/inventoryUtils';

const VALID_FILTERS: StockFilter[] = ['all', 'in_stock', 'low_stock', 'out_of_stock', 'inactive'];

export const GET = withAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '15', 10)));
    const search = (searchParams.get('search') || '').trim();
    const stockFilter = (searchParams.get('stockFilter') || 'all') as StockFilter;

    if (!VALID_FILTERS.includes(stockFilter)) {
      return NextResponse.json(
        { status: false, message: 'Invalid stock filter', statusCode: 400 },
        { status: 400 }
      );
    }

    const [statsResult] = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalUnits: { $sum: '$stockQuantity' },
          inactive: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
          outOfStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$isActive', true] },
                    { $or: [{ $eq: ['$inStock', false] }, { $eq: ['$stockQuantity', 0] }] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          lowStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$isActive', true] },
                    { $eq: ['$inStock', true] },
                    { $gt: ['$stockQuantity', 0] },
                    { $lte: ['$stockQuantity', LOW_STOCK_THRESHOLD] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          inStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$isActive', true] },
                    { $eq: ['$inStock', true] },
                    { $gt: ['$stockQuantity', LOW_STOCK_THRESHOLD] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = {
      totalProducts: statsResult?.totalProducts ?? 0,
      totalUnits: statsResult?.totalUnits ?? 0,
      inStock: statsResult?.inStock ?? 0,
      lowStock: statsResult?.lowStock ?? 0,
      outOfStock: statsResult?.outOfStock ?? 0,
      inactive: statsResult?.inactive ?? 0,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
    };

    const stockQuery = buildStockFilterQuery(stockFilter);
    const andClauses: Record<string, unknown>[] = [];

    if (Object.keys(stockQuery).length > 0) {
      andClauses.push(stockQuery);
    }

    if (search) {
      andClauses.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const filter: Record<string, unknown> =
      andClauses.length > 1 ? { $and: andClauses } : andClauses[0] || {};

    const skip = (page - 1) * limit;
    const [products, totalDocs] = await Promise.all([
      Product.find(filter)
        .populate('superCategories categories subCategories')
        .sort({ stockQuantity: 1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit) || 1;

    return NextResponse.json({
      status: true,
      message: 'Inventory fetched',
      statusCode: 200,
      data: serializeProductList(products as unknown as Record<string, unknown>[]),
      stats,
      meta: {
        totalDocs,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        stockFilter,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
