import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import { withDb } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids') || '';
    const ids = idsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (!ids.length) {
      return NextResponse.json(
        { status: false, message: 'Product ids required', statusCode: 400 },
        { status: 400 }
      );
    }

    const products = await Product.find({ _id: { $in: ids }, isActive: true })
      .select('_id stockQuantity inStock soldQuantity name price originalPrice heroImage images returnDays isReturnable')
      .lean();

    const data = Object.fromEntries(
      products.map((p) => {
        const heroImageUrl = getCloudinaryUrl(p.heroImage, { width: 400, height: 400 });
        const gallery = ((p.images as string[]) || []).map((id) =>
          getCloudinaryUrl(id, { width: 400, height: 400 })
        );
        const images = [heroImageUrl, ...gallery].filter(Boolean);

        return [
          String(p._id),
          {
            stockQuantity: p.stockQuantity ?? 0,
            inStock: p.inStock ?? false,
            soldQuantity: p.soldQuantity ?? 0,
            name: p.name,
            price: Number(p.price),
            originalPrice: p.originalPrice != null ? Number(p.originalPrice) : undefined,
            heroImageUrl,
            images,
            returnDays: p.returnDays ?? 10,
            isReturnable: p.isReturnable !== false,
          },
        ];
      })
    );

    return NextResponse.json({
      status: true,
      message: 'Stock fetched',
      statusCode: 200,
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
