import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { ProductJsonLd } from '@/domains/product/components/product-json-ld';
import {
  buildProductMetadata,
  getProductPageData
} from '@/domains/product/lib/get-product-page-data';
import { NUMERIC_PRODUCT_ID } from '@/domains/product/lib/product-routes';
import ProductDetailDomain from '~/src/domains/product/product-detail-domain';
import { prefetchWithAuth } from '~/src/lib/prefetch-with-auth';
import { getGetProductsIdQueryOptions } from '~/src/services/-products-{id}-get';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug: param } = await params;
  const pageData = await getProductPageData(param);

  if (!pageData?.product.slug) {
    return { title: 'Product Not Found' };
  }

  return buildProductMetadata(pageData.product, pageData.product.slug);
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug: param } = await params;
  const pageData = await getProductPageData(param);

  if (!pageData?.product.slug) {
    notFound();
  }

  const { product, isLiked } = pageData;
  const slug = product.slug;

  if (!slug) {
    notFound();
  }

  if (NUMERIC_PRODUCT_ID.test(param) && slug !== param) {
    permanentRedirect(`/product/${slug}`);
  }

  const queryClient = await prefetchWithAuth(getGetProductsIdQueryOptions, slug);

  return (
    <>
      <ProductJsonLd product={product} slug={slug} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductDetailDomain product={product} isLiked={isLiked} />
      </HydrationBoundary>
    </>
  );
}
