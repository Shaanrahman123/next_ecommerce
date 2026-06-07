import { NextRequest, NextResponse } from 'next/server';
import SuperCategory from '@/models/SuperCategory';
import { withDb, withAdmin } from '@/lib/apiWrapper';
import { SUPERCATEGORY_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded } from '@/lib/cloudinary';
import { getCloudinaryErrorMessage } from '@/lib/cloudinaryErrors';
import { slugify } from '@/lib/slugify';
import { withImageUrl } from '@/lib/categorySerializer';

export const GET = withDb(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const category = await SuperCategory.findById(id);

    if (!category) {
      return NextResponse.json({
        status: false,
        message: SUPERCATEGORY_MESSAGES.NOT_FOUND,
        statusCode: 404
      }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: SUPERCATEGORY_MESSAGES.FETCH_SUCCESS,
      statusCode: 200,
      data: category
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Error fetching Super Category:`, error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});

export const PUT = withAdmin(async (
  request: NextRequest,
  user: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const body = await request.json();
    const { name, description, image, isActive } = body;
    let { slug } = body;

    // Check if category exists
    const category = await SuperCategory.findById(id);
    if (!category) {
      return NextResponse.json({
        status: false,
        message: SUPERCATEGORY_MESSAGES.NOT_FOUND,
        statusCode: 404
      }, { status: 404 });
    }

    // Prepare update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    if (image !== undefined) {
      try {
        updateData.image = (await uploadImageIfNeeded(image, 'super_categories')) || '';
      } catch (uploadError) {
        return NextResponse.json(
          { status: false, message: getCloudinaryErrorMessage(uploadError), statusCode: 400 },
          { status: 400 }
        );
      }
    }

    if (slug) {
      updateData.slug = slugify(slug);
    } else if (name && !slug) {
      updateData.slug = slugify(name);
    }

    // Check for duplicates if name or slug is changing
    if (updateData.name || updateData.slug) {
      const orConditions = [];
      if (updateData.name) orConditions.push({ name: updateData.name });
      if (updateData.slug) orConditions.push({ slug: updateData.slug });

      const duplicate = await SuperCategory.findOne({
        _id: { $ne: id },
        $or: orConditions
      });

      if (duplicate) {
        return NextResponse.json({
          status: false,
          message: duplicate.name === updateData.name
            ? SUPERCATEGORY_MESSAGES.DUPLICATE_NAME
            : SUPERCATEGORY_MESSAGES.DUPLICATE_SLUG,
          statusCode: 400
        }, { status: 400 });
      }
    }

    const updatedCategory = await SuperCategory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      status: true,
      message: SUPERCATEGORY_MESSAGES.UPDATE_SUCCESS,
      statusCode: 200,
      data: withImageUrl(updatedCategory!.toObject()),
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating Super Category:`, error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});

export const DELETE = withAdmin(async (
  _request: NextRequest,
  user: any,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    const deletedCategory = await SuperCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({
        status: false,
        message: SUPERCATEGORY_MESSAGES.NOT_FOUND,
        statusCode: 404
      }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: SUPERCATEGORY_MESSAGES.DELETE_SUCCESS,
      statusCode: 200
    }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting Super Category:`, error);
    return NextResponse.json({
      status: false,
      message: error.message || GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
      statusCode: 500
    }, { status: 500 });
  }
});
