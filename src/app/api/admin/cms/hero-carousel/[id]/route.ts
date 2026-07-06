import { NextRequest, NextResponse } from 'next/server';
import HeroSlide from '@/models/HeroSlide';
import { withAdmin } from '@/lib/apiWrapper';
import { CMS_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded } from '@/lib/cloudinary';
import { getCloudinaryErrorMessage } from '@/lib/cloudinaryErrors';
import { serializeHeroSlide } from '@/lib/cms/heroSerializer';

export const GET = withAdmin(async (
  _request: NextRequest,
  _admin,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const slide = await HeroSlide.findById(id).lean();
    if (!slide) {
      return NextResponse.json(
        { status: false, message: CMS_MESSAGES.HERO_NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }
    return NextResponse.json({
      status: true,
      message: CMS_MESSAGES.HERO_FETCH_SUCCESS,
      statusCode: 200,
      data: serializeHeroSlide(slide as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const PUT = withAdmin(async (
  request: NextRequest,
  _admin,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json();

    const slide = await HeroSlide.findById(id);
    if (!slide) {
      return NextResponse.json(
        { status: false, message: CMS_MESSAGES.HERO_NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.subtitle !== undefined) updateData.subtitle = String(body.subtitle).trim();
    if (body.description !== undefined) updateData.description = String(body.description).trim();
    if (body.link !== undefined) updateData.link = String(body.link).trim();
    if (body.buttonText !== undefined) updateData.buttonText = String(body.buttonText).trim();
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder) || 0;
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    if (body.image !== undefined) {
      try {
        updateData.image = (await uploadImageIfNeeded(body.image, 'hero_carousel')) || slide.image;
      } catch (uploadError) {
        return NextResponse.json(
          { status: false, message: getCloudinaryErrorMessage(uploadError), statusCode: 400 },
          { status: 400 }
        );
      }
    }

    const updated = await HeroSlide.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

    return NextResponse.json({
      status: true,
      message: CMS_MESSAGES.HERO_UPDATE_SUCCESS,
      statusCode: 200,
      data: serializeHeroSlide(updated!.toObject() as unknown as Record<string, unknown>),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const DELETE = withAdmin(async (
  _request: NextRequest,
  _admin,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const deleted = await HeroSlide.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { status: false, message: CMS_MESSAGES.HERO_NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }
    return NextResponse.json({
      status: true,
      message: CMS_MESSAGES.HERO_DELETE_SUCCESS,
      statusCode: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
