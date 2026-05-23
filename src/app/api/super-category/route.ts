import { NextRequest, NextResponse } from 'next/server';
import SuperCategory from '@/models/SuperCategory';
import { paginate } from '@/lib/pagination';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { SUPERCATEGORY_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded } from '@/lib/cloudinary';

// helper to slugify a string
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const search = searchParams.get('search') || '';
    const isActiveStr = searchParams.get('isActive');

    const filter: any = {};

    // 1. Optional keyword search on name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // 2. Optional status filter (active/inactive)
    if (isActiveStr !== null) {
      filter.isActive = isActiveStr === 'true';
    }

    // Call central pagination function
    const paginationResult = await paginate(SuperCategory, filter, page, limit, { name: 1 });

    return NextResponse.json({
      status: true,
      message: SUPERCATEGORY_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: paginationResult.docs,
      meta: {
        totalDocs: paginationResult.totalDocs,
        limit: paginationResult.limit,
        page: paginationResult.page,
        totalPages: paginationResult.totalPages,
        hasNextPage: paginationResult.hasNextPage,
        hasPrevPage: paginationResult.hasPrevPage
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching Super Categories:', error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, description, image, isActive = true } = body;
    let { slug } = body;

    // Validation
    if (!name) {
      return NextResponse.json({
        status: false,
        message: SUPERCATEGORY_MESSAGES.NAME_REQUIRED,
        statusCode: 400
      }, { status: 400 });
    }

    // Auto-generate slug if not provided
    if (!slug) {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }

    // Check if name or slug already exists
    const duplicate = await SuperCategory.findOne({
      $or: [{ name }, { slug }]
    });

    if (duplicate) {
      return NextResponse.json({
        status: false,
        message: duplicate.name === name 
          ? SUPERCATEGORY_MESSAGES.NAME_EXISTS 
          : SUPERCATEGORY_MESSAGES.SLUG_EXISTS,
        statusCode: 400
      }, { status: 400 });
    }

    // Upload image to Cloudinary if provided, storing public_id in database
    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImageIfNeeded(image, 'super_categories') || '';
    }

    const newSuperCategory = new SuperCategory({
      name,
      slug,
      description,
      image: imageUrl,
      isActive
    });

    await newSuperCategory.save();

    return NextResponse.json({
      status: true,
      message: SUPERCATEGORY_MESSAGES.CREATE_SUCCESS,
      statusCode: 201,
      data: newSuperCategory
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating Super Category:', error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});
