import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/apiWrapper';
import { getShippingSettings, updateShippingSettings } from '@/lib/getStoreSettings';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import type { ShippingSettingsPayload } from '@/types/storeSettings';

export const GET = withAdmin(async () => {
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

export const PUT = withAdmin(async (request: NextRequest) => {
  try {
    const body = (await request.json()) as ShippingSettingsPayload;

    if (body.freeShippingThreshold !== undefined && body.freeShippingThreshold < 0) {
      return NextResponse.json(
        { status: false, message: 'Free shipping threshold cannot be negative', statusCode: 400 },
        { status: 400 }
      );
    }
    if (body.shippingFee !== undefined && body.shippingFee < 0) {
      return NextResponse.json(
        { status: false, message: 'Shipping fee cannot be negative', statusCode: 400 },
        { status: 400 }
      );
    }

    const settings = await updateShippingSettings(body);
    return NextResponse.json({
      status: true,
      message: 'Shipping settings updated',
      statusCode: 200,
      data: settings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
