import { NextRequest, NextResponse } from 'next/server';
import Category from '@/models/Category';
import SuperCategory from '@/models/SuperCategory';
import { paginate } from '@/lib/pagination';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { CATEGORY_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
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
    const superCategoryId = searchParams.get('superCategory');
    const slug = searchParams.get('slug');

    const filter: Record<string, unknown> = {};

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (isActiveStr !== null && isActiveStr !== '') filter.isActive = isActiveStr === 'true';
    if (superCategoryId) filter.superCategories = superCategoryId;
    if (slug) filter.slug = slug;

    if (all) {
      const docs = await Category.find(filter)
        .populate('superCategories')
        .sort({ sortOrder: 1, name: 1 });
      return NextResponse.json({
        status: true,
        message: CATEGORY_MESSAGES.FETCH_SUCCESS,
        statusCode: 200,
        data: serializeDocList(docs),
      });
    }

    const paginationResult = await paginate(
      Category,
      filter,
      page,
      limit,
      { sortOrder: 1, name: 1 },
      'superCategories'
    );

    return NextResponse.json({
      status: true,
      message: CATEGORY_MESSAGES.FETCH_SUCCESS,
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
    console.error('Error fetching Categories:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, description, image, isActive = true, superCategories, sortOrder = 0 } = body;
    let { slug } = body;

    if (!name) {
      return NextResponse.json(
        { status: false, message: CATEGORY_MESSAGES.NAME_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    if (!superCategories || !Array.isArray(superCategories) || superCategories.length === 0) {
      return NextResponse.json(
        { status: false, message: CATEGORY_MESSAGES.SUPER_CATEGORY_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    const existingCount = await SuperCategory.countDocuments({ _id: { $in: superCategories } });
    if (existingCount !== superCategories.length) {
      return NextResponse.json(
        { status: false, message: CATEGORY_MESSAGES.SUPER_CATEGORY_NOT_FOUND, statusCode: 400 },
        { status: 400 }
      );
    }

    slug = slug ? slugify(slug) : slugify(name);

    const duplicate = await Category.findOne({ $or: [{ name }, { slug }] });
    if (duplicate) {
      return NextResponse.json(
        {
          status: false,
          message: duplicate.name === name ? CATEGORY_MESSAGES.NAME_EXISTS : CATEGORY_MESSAGES.SLUG_EXISTS,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    let imageId = '';
    if (image) {
      try {
        imageId = (await uploadImageIfNeeded(image, 'categories')) || '';
      } catch (uploadError) {
        return NextResponse.json(
          { status: false, message: getCloudinaryErrorMessage(uploadError), statusCode: 400 },
          { status: 400 }
        );
      }
    }

    const newCategory = new Category({
      name,
      slug,
      description,
      image: imageId,
      isActive,
      superCategories,
      sortOrder,
    });

    await newCategory.save();
    await newCategory.populate('superCategories');

    return NextResponse.json(
      {
        status: true,
        message: CATEGORY_MESSAGES.CREATE_SUCCESS,
        statusCode: 201,
        data: withImageUrl(newCategory.toObject()),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating Category:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
