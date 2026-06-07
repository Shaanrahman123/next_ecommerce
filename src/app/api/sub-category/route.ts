import { NextRequest, NextResponse } from 'next/server';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';
import { paginate } from '@/lib/pagination';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { SUBCATEGORY_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded } from '@/lib/cloudinary';
import { getCloudinaryErrorMessage } from '@/lib/cloudinaryErrors';
import { slugify } from '@/lib/slugify';
import { serializeDocList, withImageUrl } from '@/lib/categorySerializer';

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const search = searchParams.get('search') || '';
    const isActiveStr = searchParams.get('isActive');
    const categoryId = searchParams.get('category');
    const slug = searchParams.get('slug');

    const filter: Record<string, unknown> = {};

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (isActiveStr !== null && isActiveStr !== '') filter.isActive = isActiveStr === 'true';
    if (categoryId) filter.category = categoryId;
    if (slug) filter.slug = slug;

    if (all) {
      const docs = await SubCategory.find(filter)
        .populate('category')
        .sort({ sortOrder: 1, name: 1 });
      return NextResponse.json({
        status: true,
        message: SUBCATEGORY_MESSAGES.FETCH_SUCCESS,
        statusCode: 200,
        data: serializeDocList(docs),
      });
    }

    const paginationResult = await paginate(
      SubCategory,
      filter,
      page,
      limit,
      { sortOrder: 1, name: 1 },
      'category'
    );

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: serializeDocList(paginationResult.docs),
      meta: {
        totalDocs: paginationResult.totalDocs,
        limit: paginationResult.limit,
        page: paginationResult.page,
        totalPages: paginationResult.totalPages,
        hasNextPage: paginationResult.hasNextPage,
        hasPrevPage: paginationResult.hasPrevPage,
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching Sub Categories:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, description, image, isActive = true, category, sortOrder = 0 } = body;
    let { slug } = body;

    if (!name) {
      return NextResponse.json(
        { status: false, message: SUBCATEGORY_MESSAGES.NAME_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { status: false, message: SUBCATEGORY_MESSAGES.CATEGORY_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return NextResponse.json(
        { status: false, message: SUBCATEGORY_MESSAGES.CATEGORY_NOT_FOUND, statusCode: 400 },
        { status: 400 }
      );
    }

    slug = slug ? slugify(slug) : slugify(name);

    const duplicate = await SubCategory.findOne({ category, slug });
    if (duplicate) {
      return NextResponse.json(
        { status: false, message: SUBCATEGORY_MESSAGES.SLUG_EXISTS, statusCode: 400 },
        { status: 400 }
      );
    }

    let imageId = '';
    if (image) {
      try {
        imageId = (await uploadImageIfNeeded(image, 'sub_categories')) || '';
      } catch (uploadError) {
        return NextResponse.json(
          { status: false, message: getCloudinaryErrorMessage(uploadError), statusCode: 400 },
          { status: 400 }
        );
      }
    }

    const newSubCategory = new SubCategory({
      name,
      slug,
      description,
      image: imageId,
      isActive,
      category,
      sortOrder,
    });

    await newSubCategory.save();
    await newSubCategory.populate('category');

    return NextResponse.json(
      {
        status: true,
        message: SUBCATEGORY_MESSAGES.CREATE_SUCCESS,
        statusCode: 201,
        data: withImageUrl(newSubCategory.toObject()),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating Sub Category:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
