import { NextResponse } from 'next/server';
import CategoryFilterField from '@/models/CategoryFilterField';
import ProductSpecOption from '@/models/ProductSpecOption';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';

export interface SpecFieldCatalogItem {
  key: string;
  label: string;
  fieldUsageCount: number;
  optionCount: number;
}

export const GET = withAdmin(async () => {
  try {
    const fieldAgg = await CategoryFilterField.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$key',
          label: { $first: '$label' },
          fieldUsageCount: { $sum: 1 },
        },
      },
    ]);

    const optionAgg = await ProductSpecOption.aggregate([
      {
        $group: {
          _id: '$key',
          optionCount: { $sum: 1 },
        },
      },
    ]);

    const optionMap = Object.fromEntries(
      optionAgg.map((o) => [String(o._id), Number(o.optionCount)])
    );

    const catalog: SpecFieldCatalogItem[] = fieldAgg
      .map((f) => ({
        key: String(f._id),
        label: String(f.label || f._id),
        fieldUsageCount: Number(f.fieldUsageCount),
        optionCount: optionMap[String(f._id)] || 0,
      }))
      .sort((a, b) => b.fieldUsageCount - a.fieldUsageCount);

    // Include keys that only exist as options (legacy / global values)
    for (const [key, count] of Object.entries(optionMap)) {
      if (!catalog.some((c) => c.key.toLowerCase() === key.toLowerCase())) {
        catalog.push({
          key,
          label: key,
          fieldUsageCount: 0,
          optionCount: count,
        });
      }
    }

    catalog.sort((a, b) => b.fieldUsageCount - a.fieldUsageCount || b.optionCount - a.optionCount);

    return NextResponse.json({
      status: true,
      message: 'Spec field catalog fetched',
      statusCode: 200,
      data: catalog,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
