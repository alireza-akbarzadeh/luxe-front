import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { ProductDetailBreadcrumb } from './components/product-detail-breadcrumb';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';
import { ProductStorePanel } from './components/product-store-panel';
import { ProductViewTracker } from './components/product-view-tracker';

const ProductInsightsSection = dynamic(() =>
  import('./components/product-insights-section').then((module) => ({
    default: module.ProductInsightsSection
  }))
);

const ProductAlternativesSection = dynamic(() =>
  import('./components/product-alternatives-section').then((module) => ({
    default: module.ProductAlternativesSection
  }))
);

const ProductSmartBundlesSection = dynamic(() =>
  import('@/domains/smart-bundles/components/product-smart-bundles-section').then((module) => ({
    default: module.ProductSmartBundlesSection
  }))
);

const ProductDetailTabs = dynamic(() =>
  import('./components/product-detail-tabs').then((module) => ({
    default: module.ProductDetailTabs
  }))
);

const RelatedProductsSection = dynamic(() =>
  import('./components/related-products-section').then((module) => ({
    default: module.RelatedProductsSection
  }))
);

interface ProductDetailDomainProps {
  product: DtoProductWithLike;
  isLiked: boolean;
}

function computeDiscount(product: DtoProductWithLike): number {
  const compare = product.compare_at_price;
  const price = Number(product.price ?? 0);
  if (!compare || compare <= price) return 0;

  return Math.min(99, Math.round(((compare - price) / compare) * 100));
}

/** Server PDP shell — product data from RSC; interactivity in client islands only. */
export default async function ProductDetailDomain({ product, isLiked }: ProductDetailDomainProps) {
  const t = await getTranslations('pdp');

  const productSlug = product.slug ?? String(product.id ?? '');
  const numericProductId = Number(product.id ?? productSlug);
  const discount = computeDiscount(product);

  const breadcrumbItems = [
    { label: t('breadcrumb.shop'), href: '/shop' },
    ...(product.store?.slug
      ? [
          {
            label: product.store.name ?? t('breadcrumb.store'),
            href: `/store/${product.store.slug}`
          }
        ]
      : []),
    ...(product.category?.name
      ? [{ label: product.category.name, href: `/shop?categoryId=${product.category.id ?? ''}` }]
      : []),
    { label: product.name || t('breadcrumb.product') }
  ];

  return (
    <div className='pb-28 lg:pb-16'>
      <ProductViewTracker productId={numericProductId} />
      <div className='mx-auto w-full max-w-screen-2xl'>
        <ProductDetailBreadcrumb
          items={breadcrumbItems}
          className='mt-6 hidden px-4 sm:px-6 lg:block lg:mt-10 lg:px-8'
        />

        <div className='mt-0 grid items-start gap-0 lg:mt-14 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 lg:px-8 xl:gap-20'>
          <div className='min-w-0'>
            <ProductGallery discount={discount} product={product} />
          </div>
          <div className='border-border/40 bg-background relative z-10 flex flex-col gap-6 rounded-t-[1.75rem] border-t px-4 pt-7 shadow-[0_-12px_40px_rgba(0,0,0,0.06)] sm:px-6 max-lg:-mt-6 lg:sticky lg:top-28 lg:z-10 lg:mt-0 lg:self-start lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:pt-0 lg:shadow-none'>
            <ProductInfo is_liked={isLiked} product={product} />
            <ProductStorePanel store={product.store} />
          </div>
        </div>
      </div>

      <div className='app-container pdp-defer-mobile'>
        <ProductInsightsSection
          productId={productSlug}
          numericProductId={numericProductId}
          product={product}
        />
      </div>

      <div className='app-container pdp-defer-mobile'>
        <ProductAlternativesSection productId={productSlug} productName={product.name} />
      </div>

      <div className='app-container pdp-defer-mobile'>
        <ProductSmartBundlesSection productId={numericProductId} />
      </div>

      <div className='app-container pdp-defer-mobile'>
        <ProductDetailTabs
          product={product}
          numericProductId={numericProductId}
          productSlug={productSlug}
        />
      </div>

      <div className='app-container pdp-defer-mobile'>
        <RelatedProductsSection
          productId={numericProductId}
          categoryId={product.category?.id}
          categoryName={product.category?.name}
        />
      </div>
    </div>
  );
}
