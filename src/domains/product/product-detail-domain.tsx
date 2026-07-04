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
  if (!product.compare_at_price) return 0;

  return Math.round(
    ((product.compare_at_price - Number(product.price)) / product.compare_at_price) * 100
  );
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
    <div className='app-container mt-20 pb-16'>
      <ProductViewTracker productId={numericProductId} />
      <ProductDetailBreadcrumb items={breadcrumbItems} />

      <div className='mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 xl:gap-20'>
        <ProductGallery discount={discount} product={product} />

        <div className='flex flex-col gap-6 lg:sticky lg:top-28 lg:z-10 lg:self-start'>
          <ProductInfo is_liked={isLiked} product={product} />
          <ProductStorePanel store={product.store} />
        </div>
      </div>

      <div className='pdp-defer-mobile'>
        <ProductInsightsSection productId={productSlug} product={product} />
      </div>

      <div className='pdp-defer-mobile'>
        <ProductAlternativesSection productId={productSlug} productName={product.name} />
      </div>

      <div className='pdp-defer-mobile'>
        <ProductSmartBundlesSection productId={numericProductId} />
      </div>

      <div className='pdp-defer-mobile'>
        <ProductDetailTabs
          product={product}
          numericProductId={numericProductId}
          productSlug={productSlug}
        />
      </div>

      <div className='pdp-defer-mobile'>
        <RelatedProductsSection
          productId={numericProductId}
          categoryId={product.category?.id}
          categoryName={product.category?.name}
        />
      </div>
    </div>
  );
}
