import { NextResponse } from 'next/server';
import { withDb } from '@/lib/apiWrapper';
import { getShippingSettings } from '@/lib/getStoreSettings';
import { GLOBAL_MESSAGES } from '@/constants/messages';

export const GET = withDb(async () => {
  try {
    const settings = await getShippingSettings();
    return NextResponse.json({
      status: true,
      message: 'Shipping settings fetched',
      statusCode: 200,
      data: settings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
