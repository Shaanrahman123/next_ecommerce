import { NextRequest, NextResponse } from 'next/server';
import SubCategory from '@/models/SubCategory';
import SuperCategory from '@/models/SuperCategory';
import { paginate } from '@/lib/pagination';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { SUBCATEGORY_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
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
    const superCategoryId = searchParams.get('superCategory');

    const filter: any = {};

    // 1. Optional keyword search on name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // 2. Optional status filter (active/inactive)
    if (isActiveStr !== null) {
      filter.isActive = isActiveStr === 'true';
    }

    // 3. Optional parent superCategories filter (checks if array contains superCategoryId)
    if (superCategoryId) {
      filter.superCategories = superCategoryId;
    }

    // Call central pagination function, populating 'superCategories' details
    const paginationResult = await paginate(
      SubCategory,
      filter,
      page,
      limit,
      { name: 1 },
      'superCategories'
    );

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.FETCH_SUCCESS,
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
    console.error('Error fetching Sub Categories:', error);
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
    const { name, description, image, isActive = true, superCategories } = body;
    let { slug } = body;

    // Validation
    if (!name) {
      return NextResponse.json({
        status: false,
        message: SUBCATEGORY_MESSAGES.NAME_REQUIRED,
        statusCode: 400
      }, { status: 400 });
    }

    if (!superCategories || !Array.isArray(superCategories) || superCategories.length === 0) {
      return NextResponse.json({
        status: false,
        message: SUBCATEGORY_MESSAGES.SUPER_CATEGORY_REQUIRED,
        statusCode: 400
      }, { status: 400 });
    }

    // Verify all parent superCategory IDs exist in DB
    let existingCount = 0;
    try {
      existingCount = await SuperCategory.countDocuments({
        _id: { $in: superCategories }
      });
    } catch (err) {
      // Handle potential invalid ObjectId casting error
    }

    if (existingCount !== superCategories.length) {
      return NextResponse.json({
        status: false,
        message: SUBCATEGORY_MESSAGES.SUPER_CATEGORY_NOT_FOUND,
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
    const duplicate = await SubCategory.findOne({
      $or: [{ name }, { slug }]
    });

    if (duplicate) {
      return NextResponse.json({
        status: false,
        message: duplicate.name === name 
          ? SUBCATEGORY_MESSAGES.NAME_EXISTS 
          : SUBCATEGORY_MESSAGES.SLUG_EXISTS,
        statusCode: 400
      }, { status: 400 });
    }

    // Upload image to Cloudinary if provided, storing public_id in database
    let imageUrl = '';
    if (image) {
      imageUrl = await uploadImageIfNeeded(image, 'sub_categories') || '';
    }

    const newSubCategory = new SubCategory({
      name,
      slug,
      description,
      image: imageUrl,
      isActive,
      superCategories
    });

    await newSubCategory.save();

    // Populate superCategories field for response detail completeness
    await newSubCategory.populate('superCategories');

    return NextResponse.json({
      status: true,
      message: SUBCATEGORY_MESSAGES.CREATE_SUCCESS,
      statusCode: 201,
      data: newSubCategory
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating Sub Category:', error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});
