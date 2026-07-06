import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';
import SuperCategory from '@/models/SuperCategory';
import { withDb } from '@/lib/apiWrapper';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';
import { GLOBAL_MESSAGES } from '@/constants/messages';

export interface ProductSearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  brand?: string;
  imageUrl: string;
  category: string;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  href: string;
  type: 'term' | 'category' | 'subcategory' | 'brand';
  subtitle?: string;
}

export interface SearchResponse {
  suggestions: SearchSuggestion[];
  products: ProductSearchResult[];
}

function buildRegex(q: string) {
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escaped, 'i');
}

function normalizeTerm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function termMatches(query: string, candidate: string) {
  const q = normalizeTerm(query);
  const c = normalizeTerm(candidate);
  if (!q || !c) return false;
  return c.includes(q) || q.includes(c) || c.replace(/s$/, '').includes(q.replace(/s$/, ''));
}

export const GET = withDb(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const limit = Math.min(10, Math.max(1, parseInt(searchParams.get('limit') || '8', 10)));

    if (q.length < 2) {
      return NextResponse.json({ status: true, statusCode: 200, data: { suggestions: [], products: [] } });
    }

    const regex = buildRegex(q);
    const suggestions: SearchSuggestion[] = [];
    const seen = new Set<string>();

    const addSuggestion = (item: SearchSuggestion) => {
      const key = `${item.type}:${item.label.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      suggestions.push(item);
    };

    addSuggestion({
      id: `term-${q}`,
      label: q,
      href: `/products?search=${encodeURIComponent(q)}`,
      type: 'term',
      subtitle: 'Search all products',
    });

    const [subCategories, categories, superCategories, brandMatches] = await Promise.all([
      SubCategory.find({ isActive: true, $or: [{ name: regex }, { slug: regex }] })
        .populate({
          path: 'category',
          select: 'name slug superCategories',
          populate: { path: 'superCategories', select: 'name slug' },
        })
        .limit(6)
        .lean(),
      Category.find({ isActive: true, $or: [{ name: regex }, { slug: regex }] })
        .populate('superCategories', 'name slug')
        .limit(4)
        .lean(),
      SuperCategory.find({ isActive: true, $or: [{ name: regex }, { slug: regex }] }).limit(3).lean(),
      Product.distinct('brand', { isActive: true, brand: regex }),
    ]);

    for (const sub of subCategories) {
      const cat = sub.category as {
        slug?: string;
        name?: string;
        superCategories?: Array<{ slug?: string }>;
      } | null;
      const dept = cat?.superCategories?.[0]?.slug;
      const catSlug = cat?.slug;
      const href =
        dept && catSlug
          ? `/products?department=${dept}&category=${catSlug}&item=${sub.slug}`
          : `/products?search=${encodeURIComponent(sub.name as string)}`;

      addSuggestion({
        id: String(sub._id),
        label: String(sub.name),
        href,
        type: 'subcategory',
        subtitle: cat?.name ? `in ${cat.name}` : 'Category',
      });
    }

    for (const cat of categories) {
      const supers = cat.superCategories as Array<{ slug?: string; name?: string }> | undefined;
      const dept = supers?.[0]?.slug;
      const href = dept
        ? `/products?department=${dept}&category=${cat.slug}`
        : `/products?search=${encodeURIComponent(String(cat.name))}`;

      addSuggestion({
        id: String(cat._id),
        label: String(cat.name),
        href,
        type: 'category',
        subtitle: supers?.[0]?.name ? `in ${supers[0].name}` : 'Category',
      });
    }

    for (const dept of superCategories) {
      addSuggestion({
        id: String(dept._id),
        label: String(dept.name),
        href: `/products?department=${dept.slug}`,
        type: 'category',
        subtitle: 'Department',
      });
    }

    for (const brand of brandMatches.filter(Boolean).slice(0, 3)) {
      addSuggestion({
        id: `brand-${brand}`,
        label: String(brand),
        href: `/products?search=${encodeURIComponent(String(brand))}`,
        type: 'brand',
        subtitle: 'Brand',
      });
    }

    const relatedSubCategories = await SubCategory.find({ isActive: true })
      .select('name slug category')
      .populate({
        path: 'category',
        select: 'slug superCategories',
        populate: { path: 'superCategories', select: 'slug' },
      })
      .limit(80)
      .lean();

    for (const sub of relatedSubCategories) {
      if (suggestions.length >= 8) break;
      if (!termMatches(q, String(sub.name))) continue;

      const cat = sub.category as {
        slug?: string;
        superCategories?: Array<{ slug?: string }>;
      } | null;
      const dept = cat?.superCategories?.[0]?.slug;
      const catSlug = cat?.slug;
      const href =
        dept && catSlug
          ? `/products?department=${dept}&category=${catSlug}&item=${sub.slug}`
          : `/products?search=${encodeURIComponent(String(sub.name))}`;

      addSuggestion({
        id: `fuzzy-${sub._id}`,
        label: String(sub.name),
        href,
        type: 'subcategory',
        subtitle: 'Related category',
      });
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: regex },
        { brand: regex },
        { slug: regex },
        { description: regex },
      ],
    })
      .select('name slug price heroImage brand subCategories')
      .populate('subCategories', 'name')
      .sort({ featured: -1, ratings: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    const productResults: ProductSearchResult[] = products.map((p) => {
      const subs = p.subCategories as Array<{ name?: string }> | undefined;
      return {
        id: String(p._id),
        name: String(p.name),
        slug: String(p.slug),
        price: Number(p.price),
        brand: p.brand ? String(p.brand) : undefined,
        imageUrl: getCloudinaryUrl(p.heroImage as string, { width: 96, height: 96, crop: 'fill' }),
        category: subs?.[0]?.name || 'Fashion',
      };
    });

    const data: SearchResponse = {
      suggestions: suggestions.slice(0, 8),
      products: productResults,
    };

    return NextResponse.json({ status: true, statusCode: 200, data });
  } catch (error: unknown) {
    console.error('Product search error:', error);
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR,
        statusCode: 500,
      },
      { status: 500 }
    );
  }
});
