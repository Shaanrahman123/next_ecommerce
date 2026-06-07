import { NextRequest, NextResponse } from 'next/server';
import SuperCategory from '@/models/SuperCategory';
import { paginate } from '@/lib/pagination';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { SUPERCATEGORY_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
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
    const slug = searchParams.get('slug');

    const filter: Record<string, unknown> = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (isActiveStr !== null && isActiveStr !== '') filter.isActive = isActiveStr === 'true';
    if (slug) filter.slug = slug;

    if (all) {
      const docs = await SuperCategory.find(filter).sort({ sortOrder: 1, name: 1 });
      return NextResponse.json({
        status: true,
        message: SUPERCATEGORY_MESSAGES.FETCH_SUCCESS,
        statusCode: 200,
        data: serializeDocList(docs),
      });
    }

    const paginationResult = await paginate(SuperCategory, filter, page, limit, { sortOrder: 1, name: 1 });

    return NextResponse.json({
      status: true,
      message: SUPERCATEGORY_MESSAGES.FETCH_SUCCESS,
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
    console.error('Error fetching Super Categories:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, description, image, isActive = true, sortOrder = 0 } = body;
    let { slug } = body;

    if (!name) {
      return NextResponse.json(
        { status: false, message: SUPERCATEGORY_MESSAGES.NAME_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { status: false, message: 'Department image is required', statusCode: 400 },
        { status: 400 }
      );
    }

    slug = slug ? slugify(slug) : slugify(name);

    const duplicate = await SuperCategory.findOne({ $or: [{ name }, { slug }] });
    if (duplicate) {
      return NextResponse.json(
        {
          status: false,
          message: duplicate.name === name ? SUPERCATEGORY_MESSAGES.NAME_EXISTS : SUPERCATEGORY_MESSAGES.SLUG_EXISTS,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    let imageId = '';
    if (image) {
      try {
        imageId = (await uploadImageIfNeeded(image, 'super_categories')) || '';
      } catch (uploadError) {
        return NextResponse.json(
          { status: false, message: getCloudinaryErrorMessage(uploadError), statusCode: 400 },
          { status: 400 }
        );
      }
    }

    const newSuperCategory = new SuperCategory({
      name,
      slug,
      description,
      image: imageId,
      isActive,
      sortOrder,
    });

    await newSuperCategory.save();

    return NextResponse.json(
      {
        status: true,
        message: SUPERCATEGORY_MESSAGES.CREATE_SUCCESS,
        statusCode: 201,
        data: withImageUrl(newSuperCategory.toObject()),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating Super Category:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
