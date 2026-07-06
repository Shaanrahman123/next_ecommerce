import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import SuperCategory from '@/models/SuperCategory';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import { PRODUCT_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded, uploadMultipleImages } from '@/lib/cloudinary';
import { getCloudinaryErrorMessage } from '@/lib/cloudinaryErrors';
import { slugify } from '@/lib/slugify';
import { serializeProduct, serializeProductList } from '@/lib/productSerializer';
import { sanitizeHomeSections } from '@/constants/homeSections';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { resolveCategoryContext, buildProductFilterFromContext } from '@/lib/categoryContext';
import {
  getFilterFieldsForContext,
  parseSpecFiltersFromSearchParams,
  applySpecFiltersToQuery,
} from '@/lib/productFilters';

function applySort(docs: Record<string, unknown>[], sortBy: string) {
  const sorted = [...docs];
  switch (sortBy) {
    case 'price-low-high':
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price-high-low':
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'rating':
      sorted.sort((a, b) => Number(b.ratings || 0) - Number(a.ratings || 0));
      break;
    case 'discount':
      sorted.sort((a, b) => {
        const discA =
          a.originalPrice && Number(a.originalPrice) > Number(a.price)
            ? ((Number(a.originalPrice) - Number(a.price)) / Number(a.originalPrice)) * 100
            : 0;
        const discB =
          b.originalPrice && Number(b.originalPrice) > Number(b.price)
            ? ((Number(b.originalPrice) - Number(b.price)) / Number(b.originalPrice)) * 100
            : 0;
        return discB - discA;
      });
      break;
    case 'newest':
    default:
      sorted.sort(
        (a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime()
      );
  }
  return sorted;
}

// GET /api/product — List products with filters & pagination (public)
export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const search = searchParams.get('search') || '';
    const isActiveStr = searchParams.get('isActive');
    const featured = searchParams.get('featured');
    const gender = searchParams.get('gender');
    const superCategoryId = searchParams.get('superCategory');
    const categoryIdParam = searchParams.get('categoryId');
    const subCategoryIdParam = searchParams.get('subCategory');
    const inStockStr = searchParams.get('inStock');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const homeSection = searchParams.get('homeSection');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const brandParam = searchParams.get('brand');
    const colorsParam = searchParams.get('colors');
    const discountMin = searchParams.get('discountMin');
    const departmentSlug = searchParams.get('department');
    const categorySlug = searchParams.get('category');
    const itemSlug = searchParams.get('item');
    const all = searchParams.get('all') === 'true';

    const ctx = await resolveCategoryContext({
      department:
        departmentSlug === 'boys' || departmentSlug === 'girls' ? null : departmentSlug,
      category: categorySlug,
      item: itemSlug,
    });

    const filter: Record<string, unknown> = {};

    if (!all && isActiveStr === null) {
      filter.isActive = true;
    } else if (isActiveStr !== null) {
      filter.isActive = isActiveStr === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (featured !== null) filter.featured = featured === 'true';

    const contextFilter = await buildProductFilterFromContext(ctx, {}, departmentSlug);
    if (contextFilter.subCategories) filter.subCategories = contextFilter.subCategories;
    if (contextFilter.categories) filter.categories = contextFilter.categories;
    if (contextFilter.superCategories) filter.superCategories = contextFilter.superCategories;
    if (contextFilter.gender) filter.gender = contextFilter.gender;

    if (subCategoryIdParam) filter.subCategories = subCategoryIdParam;
    else if (categoryIdParam) {
      filter.categories = categoryIdParam;
      delete filter.subCategories;
    } else if (superCategoryId) {
      filter.superCategories = superCategoryId;
    }

    if (gender) filter.gender = gender;

    if (inStockStr !== null) filter.inStock = inStockStr === 'true';
    if (homeSection) filter.homeSections = homeSection;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    if (brandParam) {
      const brands = brandParam.split(',').map((b) => decodeURIComponent(b.trim())).filter(Boolean);
      if (brands.length) filter.brand = { $in: brands };
    }

    if (colorsParam) {
      const colors = colorsParam.split(',').map((c) => decodeURIComponent(c.trim())).filter(Boolean);
      if (colors.length) {
        filter.$and = (filter.$and as unknown[] | undefined) || [];
        (filter.$and as unknown[]).push({
          $or: [{ colors: { $in: colors } }, { 'colorVariants.name': { $in: colors } }],
        });
      }
    }

    const filterFields = await getFilterFieldsForContext(ctx);
    const fieldKeys = filterFields.map((f) => f.key);
    const specFilters = parseSpecFiltersFromSearchParams(searchParams, fieldKeys);
    applySpecFiltersToQuery(filter, specFilters);

    let products = await Product.find(filter)
      .populate('superCategories categories subCategories')
      .sort({ createdAt: -1 })
      .lean();

    if (discountMin) {
      const min = Number(discountMin);
      products = products.filter((p) => {
        if (!p.originalPrice || p.originalPrice <= p.price) return false;
        const disc = ((p.originalPrice - p.price) / p.originalPrice) * 100;
        return disc >= min;
      });
    }

    const plainProducts = products as unknown as Record<string, unknown>[];
    const sorted = applySort(plainProducts, sortBy);

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.max(1, parseInt(String(limit), 10));
    const skip = (pageNum - 1) * limitNum;
    const totalDocs = sorted.length;
    const paged = sorted.slice(skip, skip + limitNum);
    const totalPages = Math.ceil(totalDocs / limitNum);

    return NextResponse.json({
      status: true,
      message: PRODUCT_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: serializeProductList(paged),
      context: ctx,
      meta: {
        totalDocs,
        limit: limitNum,
        page: pageNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching Products:', error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500,
    }, { status: 500 });
  }
});

// POST /api/product — Create a new product (admin only)
export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      heroImage,
      images = [],
      superCategories,
      categories,
      subCategories = [],
      inStock = true,
      stockQuantity = 0,
      returnDays = 10,
      isReturnable = true,
      isActive = true,
      featured = false,
      homeSections = [],
      gender = 'unisex',
      sizes = [],
      colors = [],
      colorVariants = [],
      brand,
      material,
      season,
      specifications = [],
    } = body;
    let { slug } = body;

    // ── Required field validation ──────────────────────────────────────────────
    if (!name) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.NAME_REQUIRED,
        statusCode: 400,
      }, { status: 400 });
    }

    if (price === undefined || price === null) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.PRICE_REQUIRED,
        statusCode: 400,
      }, { status: 400 });
    }

    if (!heroImage) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.HERO_IMAGE_REQUIRED,
        statusCode: 400,
      }, { status: 400 });
    }

    if (!superCategories || !Array.isArray(superCategories) || superCategories.length === 0) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.SUPER_CATEGORIES_REQUIRED,
        statusCode: 400,
      }, { status: 400 });
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.CATEGORIES_REQUIRED,
        statusCode: 400,
      }, { status: 400 });
    }

    // ── Validate referenced IDs exist in DB ────────────────────────────────────
    let scCount = 0;
    let catCount = 0;
    let subCatCount = 0;

    try {
      scCount = await SuperCategory.countDocuments({ _id: { $in: superCategories } });
    } catch (_) {}

    if (scCount !== superCategories.length) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.SUPER_CATEGORIES_INVALID,
        statusCode: 400,
      }, { status: 400 });
    }

    try {
      catCount = await Category.countDocuments({ _id: { $in: categories } });
    } catch (_) {}

    if (catCount !== categories.length) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.CATEGORIES_INVALID,
        statusCode: 400,
      }, { status: 400 });
    }

    if (subCategories.length > 0) {
      try {
        subCatCount = await SubCategory.countDocuments({ _id: { $in: subCategories } });
      } catch (_) {}

      if (subCatCount !== subCategories.length) {
        return NextResponse.json({
          status: false,
          message: PRODUCT_MESSAGES.SUBCATEGORIES_INVALID,
          statusCode: 400,
        }, { status: 400 });
      }
    }

    // ── Auto-generate slug ─────────────────────────────────────────────────────
    if (!slug) {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }

    // ── Duplicate name / slug check ────────────────────────────────────────────
    const duplicate = await Product.findOne({ $or: [{ name }, { slug }] });
    if (duplicate) {
      return NextResponse.json({
        status: false,
        message: duplicate.name === name
          ? PRODUCT_MESSAGES.DUPLICATE_NAME
          : PRODUCT_MESSAGES.DUPLICATE_SLUG,
        statusCode: 400,
      }, { status: 400 });
    }

    // ── Upload images to Cloudinary ────────────────────────────────────────────
    let uploadedHeroImage: string;
    let uploadedImages: string[] = [];

    try {
      uploadedHeroImage = (await uploadImageIfNeeded(heroImage, 'products')) || '';
      if (Array.isArray(images) && images.length > 0) {
        uploadedImages = await uploadMultipleImages(images, 'products');
      }
    } catch (uploadError) {
      return NextResponse.json(
        { status: false, message: getCloudinaryErrorMessage(uploadError), statusCode: 400 },
        { status: 400 }
      );
    }

    const resolvedColors =
      colorVariants.length > 0 ? colorVariants.map((c: { name: string }) => c.name) : colors;

    // Validate home page section IDs
    const validatedHomeSections = sanitizeHomeSections(homeSections);

    // ── Create and save product ────────────────────────────────────────────────
    const newProduct = new Product({
      name,
      slug,
      description,
      price,
      originalPrice,
      heroImage: uploadedHeroImage,
      images: uploadedImages,
      superCategories,
      categories,
      subCategories,
      inStock: stockQuantity > 0 ? inStock : false,
      stockQuantity,
      returnDays: Math.max(0, Number(returnDays) || 10),
      isReturnable: Boolean(isReturnable),
      isActive,
      featured,
      homeSections: validatedHomeSections,
      gender,
      sizes,
      colors: resolvedColors,
      colorVariants,
      brand,
      material,
      season,
      specifications,
    });

    await newProduct.save();
    await newProduct.populate('superCategories categories subCategories');

    return NextResponse.json({
      status: true,
      message: PRODUCT_MESSAGES.CREATE_SUCCESS,
      statusCode: 201,
      data: serializeProduct(newProduct.toObject() as unknown as Record<string, unknown>),
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating Product:', error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500,
    }, { status: 500 });
  }
});
