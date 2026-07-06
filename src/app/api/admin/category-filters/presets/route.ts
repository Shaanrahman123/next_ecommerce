import { NextRequest, NextResponse } from 'next/server';
import CategoryFilterField from '@/models/CategoryFilterField';
import SubCategory from '@/models/SubCategory';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';

const PRESETS: Record<string, { key: string; label: string }[]> = {
  topwear: [
    { key: 'Sleeve Type', label: 'Sleeve Type' },
    { key: 'Collar Type', label: 'Collar Type' },
    { key: 'Fit Type', label: 'Fit Type' },
    { key: 'Fabric', label: 'Fabric' },
    { key: 'Pattern', label: 'Pattern' },
    { key: 'Occasion', label: 'Occasion' },
  ],
  't-shirts': [
    { key: 'Fit Type', label: 'Fit Type' },
    { key: 'Fabric', label: 'Fabric' },
    { key: 'Pattern', label: 'Pattern' },
    { key: 'Occasion', label: 'Occasion' },
    { key: 'Neck Type', label: 'Neck Type' },
  ],
  shirts: [
    { key: 'Sleeve Type', label: 'Sleeve Type' },
    { key: 'Collar Type', label: 'Collar Type' },
    { key: 'Fit Type', label: 'Fit Type' },
    { key: 'Fabric', label: 'Fabric' },
    { key: 'Pattern', label: 'Pattern' },
    { key: 'Occasion', label: 'Occasion' },
  ],
  jeans: [
    { key: 'Fit Type', label: 'Fit Type' },
    { key: 'Rise', label: 'Rise' },
    { key: 'Wash', label: 'Wash' },
    { key: 'Fabric', label: 'Fabric' },
    { key: 'Stretch', label: 'Stretch' },
  ],
  bottomwear: [
    { key: 'Fit Type', label: 'Fit Type' },
    { key: 'Rise', label: 'Rise' },
    { key: 'Fabric', label: 'Fabric' },
    { key: 'Occasion', label: 'Occasion' },
  ],
  footwear: [
    { key: 'Shoe Type', label: 'Shoe Type' },
    { key: 'Closure Type', label: 'Closure Type' },
    { key: 'Sole Material', label: 'Sole Material' },
    { key: 'Occasion', label: 'Occasion' },
  ],
  watches: [
    { key: 'Watch Type', label: 'Watch Type' },
    { key: 'Movement', label: 'Movement' },
    { key: 'Strap Material', label: 'Strap Material' },
    { key: 'Case Material', label: 'Case Material' },
    { key: 'Dial Color', label: 'Dial Color' },
    { key: 'Water Resistance', label: 'Water Resistance' },
  ],
  watch: [
    { key: 'Watch Type', label: 'Watch Type' },
    { key: 'Movement', label: 'Movement' },
    { key: 'Strap Material', label: 'Strap Material' },
    { key: 'Case Material', label: 'Case Material' },
    { key: 'Dial Color', label: 'Dial Color' },
    { key: 'Water Resistance', label: 'Water Resistance' },
  ],
  accessories: [
    { key: 'Accessory Type', label: 'Accessory Type' },
    { key: 'Material', label: 'Material' },
    { key: 'Occasion', label: 'Occasion' },
  ],
  bags: [
    { key: 'Bag Type', label: 'Bag Type' },
    { key: 'Material', label: 'Material' },
    { key: 'Capacity', label: 'Capacity' },
  ],
};

export const GET = withAdmin(async () => {
  return NextResponse.json({
    status: true,
    message: 'Presets fetched',
    statusCode: 200,
    data: Object.keys(PRESETS),
  });
});

export const POST = withAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { subCategory, preset } = body;

    if (!subCategory || !preset) {
      return NextResponse.json(
        { status: false, message: 'subCategory and preset are required', statusCode: 400 },
        { status: 400 }
      );
    }

    const sub = await SubCategory.findById(subCategory);
    if (!sub) {
      return NextResponse.json({ status: false, message: 'Sub category not found', statusCode: 400 }, { status: 400 });
    }

    const presetKey = preset.toLowerCase();
    const items = PRESETS[presetKey] || PRESETS[sub.slug] || PRESETS.topwear;

    const created = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const exists = await CategoryFilterField.findOne({ subCategory, key: item.key });
      if (!exists) {
        const field = await CategoryFilterField.create({
          subCategory,
          key: item.key,
          label: item.label,
          sortOrder: i,
          isActive: true,
        });
        created.push(field);
      }
    }

    return NextResponse.json({
      status: true,
      message: `Applied ${created.length} filter fields`,
      statusCode: 201,
      data: created,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
