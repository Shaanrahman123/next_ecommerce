import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import SuperCategory from '@/models/SuperCategory';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { PRODUCT_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded, uploadMultipleImages } from '@/lib/cloudinary';
import { getCloudinaryErrorMessage } from '@/lib/cloudinaryErrors';
import { slugify } from '@/lib/slugify';
import { serializeProduct } from '@/lib/productSerializer';
import { sanitizeHomeSections } from '@/constants/homeSections';

// GET /api/product/[id] — Get single product detail (public)
export const GET = withDb(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const product = await Product.findOne({ _id: id, isActive: true })
      .populate('superCategories')
      .populate('categories')
      .populate('subCategories');

    if (!product) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.NOT_FOUND,
        statusCode: 404,
      }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: PRODUCT_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: serializeProduct(product.toObject() as unknown as Record<string, unknown>),
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching Product:', error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500,
    }, { status: 500 });
  }
});

// PUT /api/product/[id] — Update product (admin only)
export const PUT = withAdmin(async (
  request: NextRequest,
  user: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      price,
      originalPrice,
      heroImage,
      images,
      superCategories,
      categories,
      subCategories,
      inStock,
      stockQuantity,
      returnDays,
      isReturnable,
      isActive,
      featured,
      homeSections,
      gender,
      sizes,
      colors,
      colorVariants,
      brand,
      material,
      season,
      specifications,
    } = body;
    let { slug } = body;

    // ── Check product exists ───────────────────────────────────────────────────
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.NOT_FOUND,
        statusCode: 404,
      }, { status: 404 });
    }

    // ── Validate referenced IDs if they are changing ───────────────────────────
    if (superCategories !== undefined) {
      if (!Array.isArray(superCategories) || superCategories.length === 0) {
        return NextResponse.json({
          status: false,
          message: PRODUCT_MESSAGES.SUPER_CATEGORIES_REQUIRED,
          statusCode: 400,
        }, { status: 400 });
      }
      let scCount = 0;
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
    }

    if (categories !== undefined) {
      if (!Array.isArray(categories) || categories.length === 0) {
        return NextResponse.json({
          status: false,
          message: PRODUCT_MESSAGES.CATEGORIES_REQUIRED,
          statusCode: 400,
        }, { status: 400 });
      }
      let catCount = 0;
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
    }

    if (subCategories !== undefined && Array.isArray(subCategories) && subCategories.length > 0) {
      let subCatCount = 0;
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

    // ── Build update payload ───────────────────────────────────────────────────
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
    if (stockQuantity !== undefined) {
      updateData.stockQuantity = stockQuantity;
      if (inStock === undefined) {
        updateData.inStock = stockQuantity > 0;
      }
    }
    if (returnDays !== undefined) updateData.returnDays = Math.max(0, Number(returnDays) || 0);
    if (isReturnable !== undefined) updateData.isReturnable = Boolean(isReturnable);
    if (inStock !== undefined) updateData.inStock = inStock;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (featured !== undefined) updateData.featured = featured;
    if (homeSections !== undefined) {
      updateData.homeSections = sanitizeHomeSections(homeSections);
    }
    if (gender !== undefined) updateData.gender = gender;
    if (sizes !== undefined) updateData.sizes = sizes;
    if (colors !== undefined) updateData.colors = colors;
    if (colorVariants !== undefined) {
      updateData.colorVariants = colorVariants;
      updateData.colors = colorVariants.map((c: { name: string }) => c.name);
    }
    if (brand !== undefined) updateData.brand = brand;
    if (material !== undefined) updateData.material = material;
    if (season !== undefined) updateData.season = season;
    if (specifications !== undefined) updateData.specifications = specifications;
    if (superCategories !== undefined) updateData.superCategories = superCategories;
    if (categories !== undefined) updateData.categories = categories;
    if (subCategories !== undefined) updateData.subCategories = subCategories;

    // Slug: auto-generate from new name, or use explicit slug value
    if (slug) {
      updateData.slug = slugify(slug);
    } else if (name && !slug) {
      updateData.slug = slugify(name);
    }

    // ── Upload images if they have changed ────────────────────────────────────
    try {
      if (heroImage !== undefined) {
        updateData.heroImage = (await uploadImageIfNeeded(heroImage, 'products')) || '';
      }

      if (images !== undefined && Array.isArray(images)) {
        if (images.length > 0) {
          updateData.images = await uploadMultipleImages(images, 'products');
        } else {
          updateData.images = [];
        }
      }
    } catch (uploadError) {
      return NextResponse.json(
        { status: false, message: getCloudinaryErrorMessage(uploadError), statusCode: 400 },
        { status: 400 }
      );
    }

    // ── Duplicate name / slug check (excluding self) ───────────────────────────
    if (updateData.name || updateData.slug) {
      const orConditions: any[] = [];
      if (updateData.name) orConditions.push({ name: updateData.name });
      if (updateData.slug) orConditions.push({ slug: updateData.slug });

      const duplicate = await Product.findOne({
        _id: { $ne: id },
        $or: orConditions,
      });

      if (duplicate) {
        return NextResponse.json({
          status: false,
          message: duplicate.name === updateData.name
            ? PRODUCT_MESSAGES.DUPLICATE_NAME
            : PRODUCT_MESSAGES.DUPLICATE_SLUG,
          statusCode: 400,
        }, { status: 400 });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('superCategories')
      .populate('categories')
      .populate('subCategories');

    return NextResponse.json({
      status: true,
      message: PRODUCT_MESSAGES.UPDATE_SUCCESS,
      statusCode: 200,
      data: serializeProduct(updatedProduct!.toObject() as unknown as Record<string, unknown>),
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error updating Product:', error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500,
    }, { status: 500 });
  }
});

// DELETE /api/product/[id] — Delete product (admin only)
export const DELETE = withAdmin(async (
  _request: NextRequest,
  user: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({
        status: false,
        message: PRODUCT_MESSAGES.NOT_FOUND,
        statusCode: 404,
      }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: PRODUCT_MESSAGES.DELETE_SUCCESS,
      statusCode: 200,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting Product:', error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500,
    }, { status: 500 });
  }
});
