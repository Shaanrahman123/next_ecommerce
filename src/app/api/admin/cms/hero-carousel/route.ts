import { NextRequest, NextResponse } from 'next/server';
import HeroSlide from '@/models/HeroSlide';
import { withAdmin } from '@/lib/apiWrapper';
import { CMS_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { uploadImageIfNeeded } from '@/lib/cloudinary';
import { getCloudinaryErrorMessage } from '@/lib/cloudinaryErrors';
import { serializeHeroSlide, serializeHeroSlideList } from '@/lib/cms/heroSerializer';

export const GET = withAdmin(async () => {
  try {
    const slides = await HeroSlide.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({
      status: true,
      message: CMS_MESSAGES.HERO_FETCH_SUCCESS,
      statusCode: 200,
      data: serializeHeroSlideList(slides as unknown as Record<string, unknown>[]),
    });
  } catch (error: unknown) {
    console.error('Error fetching hero slides:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      title,
      subtitle = '',
      description = '',
      image,
      link = '/products',
      buttonText = 'Shop Collection',
      sortOrder = 0,
      isActive = true,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { status: false, message: CMS_MESSAGES.HERO_TITLE_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }
    if (!image) {
      return NextResponse.json(
        { status: false, message: CMS_MESSAGES.HERO_IMAGE_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }
    if (!link?.trim()) {
      return NextResponse.json(
        { status: false, message: CMS_MESSAGES.HERO_LINK_REQUIRED, statusCode: 400 },
        { status: 400 }
      );
    }

    let uploadedImage: string;
    try {
      uploadedImage = (await uploadImageIfNeeded(image, 'hero_carousel')) || '';
    } catch (uploadError) {
      return NextResponse.json(
        { status: false, message: getCloudinaryErrorMessage(uploadError), statusCode: 400 },
        { status: 400 }
      );
    }

    const slide = await HeroSlide.create({
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      image: uploadedImage,
      link: link.trim(),
      buttonText: buttonText.trim() || 'Shop Collection',
      sortOrder: Number(sortOrder) || 0,
      isActive,
    });

    return NextResponse.json(
      {
        status: true,
        message: CMS_MESSAGES.HERO_CREATE_SUCCESS,
        statusCode: 201,
        data: serializeHeroSlide(slide.toObject() as unknown as Record<string, unknown>),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating hero slide:', error);
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
