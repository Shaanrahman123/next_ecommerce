import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import SuperCategory from '@/models/SuperCategory';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import { paginate } from '@/lib/pagination';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { PRODUCT_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded, uploadMultipleImages } from '@/lib/cloudinary';
import { getCloudinaryErrorMessage } from '@/lib/cloudinaryErrors';
import { slugify } from '@/lib/slugify';
import { serializeProduct, serializeProductList } from '@/lib/productSerializer';
import { sanitizeHomeSections } from '@/constants/homeSections';

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
    const categoryId = searchParams.get('category');
    const subCategoryId = searchParams.get('subCategory');
    const inStockStr = searchParams.get('inStock');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const homeSection = searchParams.get('homeSection');

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (isActiveStr !== null) filter.isActive = isActiveStr === 'true';
    if (featured !== null) filter.featured = featured === 'true';
    if (gender) filter.gender = gender;
    if (superCategoryId) filter.superCategories = superCategoryId;
    if (categoryId) filter.categories = categoryId;
    if (subCategoryId) filter.subCategories = subCategoryId;
    if (inStockStr !== null) filter.inStock = inStockStr === 'true';
    if (homeSection) filter.homeSections = homeSection;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const paginationResult = await paginate(
      Product,
      filter,
      page,
      limit,
      { createdAt: -1 },
      'superCategories categories subCategories'
    );

    return NextResponse.json({
      status: true,
      message: PRODUCT_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: serializeProductList(paginationResult.docs as unknown as Record<string, unknown>[]),
      meta: {
        totalDocs: paginationResult.totalDocs,
        limit: paginationResult.limit,
        page: paginationResult.page,
        totalPages: paginationResult.totalPages,
        hasNextPage: paginationResult.hasNextPage,
        hasPrevPage: paginationResult.hasPrevPage,
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
