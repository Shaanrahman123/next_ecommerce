import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/apiWrapper';
import SpecialOffer from '@/models/SpecialOffer';

/** GET /api/admin/cms/special-offers */
export const GET = withAdmin(async () => {
  const doc = await SpecialOffer.findOne({}).lean();
  return NextResponse.json({ status: true, data: doc, statusCode: 200 });
});

/** PUT /api/admin/cms/special-offers — upsert the special offers document */
export const PUT = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { badge, heading, headingAccent, subtitle, isActive, offers } = body;

    const doc = await SpecialOffer.findOneAndUpdate(
      {},
      { badge, heading, headingAccent, subtitle, isActive, offers },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ status: true, data: doc, statusCode: 200, message: 'Special offers updated' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update special offers';
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
