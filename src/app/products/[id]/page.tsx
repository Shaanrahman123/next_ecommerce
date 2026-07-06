import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProductDetail, getSimilarProducts } from '@/lib/cms/getProductDetail';
import { toClientProductDetail, toClientProductList } from '@/lib/storefrontProductMapper';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import ProductDetailSkeleton from '@/components/product/ProductDetailSkeleton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductDetail(id);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

async function ProductDetailContent({ id }: { id: string }) {
  const product = await getProductDetail(id);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(
    product.id,
    product.categoryIds,
    product.subCategoryIds
  );

  return (
    <ProductDetailClient
      product={toClientProductDetail(product)}
      similarProducts={toClientProductList(similarProducts)}
    />
  );
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent id={id} />
    </Suspense>
  );
}
