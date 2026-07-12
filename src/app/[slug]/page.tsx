import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import CmsPage from '@/models/CmsPage';
import CmsPageView from '@/components/cms/CmsPageView';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate SEO metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await dbConnect();
    const page = await CmsPage.findOne({ slug, isPublished: true }).select('title metaDescription').lean();
    if (!page) return { title: 'Page Not Found' };
    return {
      title: `${page.title} | BLAK BLAZE`,
      description: page.metaDescription || `${page.title} - BLAK BLAZE`,
    };
  } catch {
    return { title: 'BLAK BLAZE' };
  }
}

export default async function CmsPageRoute({ params }: Props) {
  const { slug } = await params;

  await dbConnect();
  const page = await CmsPage.findOne({ slug, isPublished: true }).lean();

  if (!page) notFound();

  return (
    <CmsPageView
      title={page.title}
      slug={page.slug}
      content={page.content}
      updatedAt={page.updatedAt?.toISOString?.() ?? ''}
    />
  );
}
