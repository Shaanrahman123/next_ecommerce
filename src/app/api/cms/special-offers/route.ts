import { NextResponse } from 'next/server';
import { withDb } from '@/lib/apiWrapper';
import SpecialOffer from '@/models/SpecialOffer';

const DEFAULT_OFFERS = {
  badge: 'Limited Time',
  heading: 'Special',
  headingAccent: 'Offers',
  subtitle: "Festive deals you don't want to miss.",
  offers: [
    { icon: 'Tag', title: 'Flat 50% Off', description: 'On first purchase', link: '/products?offer=first-purchase' },
    { icon: 'TrendingUp', title: 'Buy 2 Get 1', description: 'On selected items', link: '/products?offer=buy2get1' },
    { icon: 'Zap', title: 'Flash Sale', description: 'Up to 70% off', link: '/products?offer=flash-sale' },
    { icon: 'Gift', title: 'Free Shipping', description: 'Orders above ₹999', link: '/products' },
  ],
};

/** GET /api/cms/special-offers — returns active special offers data */
export const GET = withDb(async () => {
  try {
    const doc = await SpecialOffer.findOne({ isActive: true }).lean();

    if (!doc || !doc.offers || doc.offers.length === 0) {
      return NextResponse.json({ status: true, data: DEFAULT_OFFERS, statusCode: 200 });
    }

    return NextResponse.json({
      status: true,
      statusCode: 200,
      data: {
        badge: doc.badge,
        heading: doc.heading,
        headingAccent: doc.headingAccent,
        subtitle: doc.subtitle,
        offers: doc.offers,
      },
    });
  } catch {
    return NextResponse.json({ status: true, data: DEFAULT_OFFERS, statusCode: 200 });
  }
});
