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
  const product = await getProductPageData(param);

  if (!product?.slug) {
    return { title: 'Product Not Found' };
  }

  return buildProductMetadata(product, product.slug);
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug: param } = await params;
  const product = await getProductPageData(param);

  if (!product?.slug) {
    notFound();
  }

  if (NUMERIC_PRODUCT_ID.test(param) && product.slug !== param) {
    permanentRedirect(`/product/${product.slug}`);
  }

  const queryClient = await prefetchWithAuth(getGetProductsIdQueryOptions, product.slug);

  return (
    <>
      <ProductJsonLd product={product} slug={product.slug} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductDetailDomain productId={product.slug} />
      </HydrationBoundary>
    </>
  );
}
