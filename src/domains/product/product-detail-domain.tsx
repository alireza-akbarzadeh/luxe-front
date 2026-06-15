'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';
import { useGetProductsId } from '~/src/services/-products-{id}-get';

import { ProductAlternativesSection } from './components/product-alternatives-section';
import ProductDescription from './components/product-description';
import { ProductDetailSkeleton } from './components/product-detail-skeleton';
import { ProductGallery } from './components/product-gallery';
import { ProductInfo } from './components/product-info';
import { ProductInsightsSection } from './components/product-insights-section';
import { ProductQaSection } from './components/product-qa-section';
import { ProductSpecifications } from './components/product-specification';
import { ProductStorePanel } from './components/product-store-panel';
import { ProductVideoPlayer } from './components/product-video-player';
import { RelatedProductsSection } from './components/related-products-section';
import { hasCustomProductVideo } from './lib/product-media-utils';
import { ProductReviewsSection } from './sections/product-reviews-section';

export default function ProductDetailDomain({ productId }: { productId: string }) {
  const { data, isPending, isError } = useGetProductsId(productId);

  if (isPending) {
    return <ProductDetailSkeleton />;
  }

  const product = data?.data?.product;

  if (isError || !product) {
    notFound();
  }

  const numericProductId = Number(product.id ?? productId);
  const productSlug = product.slug ?? productId;
  const showVideoTab = hasCustomProductVideo(product) || Boolean(product.is_digital);

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - Number(product.price)) / product.compare_at_price) * 100
      )
    : 0;

  const breadcrumbItems = [
    { label: 'Shop', href: '/shop' },
    ...(product.store?.slug
      ? [{ label: product.store.name ?? 'Store', href: `/store/${product.store.slug}` }]
      : []),
    ...(product.category?.name
      ? [{ label: product.category.name, href: `/shop?categoryId=${product.category.id ?? ''}` }]
      : []),
    { label: product.name || 'Product' }
  ];

  const tabs = [
    { value: 'description', label: 'Description' },
    ...(showVideoTab ? [{ value: 'video' as const, label: 'Video' }] : []),
    { value: 'details', label: 'Details & specs' },
    { value: 'qa', label: 'Q&A' },
    { value: 'reviews', label: `Reviews (${product.reviews_count ?? 0})` }
  ];

  return (
    <div className='app-container mt-20 pb-16'>
      <DynamicBreadcrumb
        items={breadcrumbItems}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground text-xs'
        breadcrumbClassName='flex items-center gap-1.5'
        showBackButton={false}
      />

      <div className='mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 xl:gap-20'>
        <ProductGallery discount={discount} product={product} />

        <div className='flex flex-col gap-6 lg:sticky lg:top-28 lg:z-10 lg:self-start'>
          <ProductInfo is_liked={data.data?.is_liked || false} product={product} />
          <ProductStorePanel store={product.store} />
        </div>
      </div>

      <ProductInsightsSection productId={productSlug} product={product} />

      <ProductAlternativesSection productId={productSlug} productName={product.name} />

      <section className='mt-20 lg:mt-24'>
        <Tabs defaultValue='description' className='w-full'>
          <TabsList className='border-border h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0'>
            {tabs.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className='data-[state=active]:border-accent data-[state=active]:text-foreground text-muted-foreground rounded-none border-b-2 border-transparent bg-transparent px-4 pt-2 pb-3 text-sm font-medium whitespace-nowrap data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='description' className='mt-10 max-w-3xl'>
            <h2 className='font-display mb-4 text-2xl font-semibold'>About this piece</h2>
            <ProductDescription description={product.description || ''} tags={product.tags} />
          </TabsContent>

          {showVideoTab && (
            <TabsContent value='video' className='mt-10 max-w-3xl'>
              <h2 className='font-display mb-4 text-2xl font-semibold'>Product video</h2>
              <p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
                Watch how this piece looks, moves, and fits — a closer look before you add it to
                your cart.
              </p>
              <ProductVideoPlayer product={product} className='max-w-2xl' />
            </TabsContent>
          )}

          <TabsContent value='details' id='product-specs' className='mt-10 max-w-4xl scroll-mt-28'>
            <h2 className='font-display mb-4 text-2xl font-semibold'>Details & specifications</h2>
            <div className='border-border/60 bg-card rounded-2xl border p-6 sm:p-8'>
              <ProductSpecifications product={product} />
            </div>
          </TabsContent>

          <TabsContent value='qa' className='mt-10 max-w-3xl'>
            <div className='mb-8'>
              <h2 className='font-display text-2xl font-semibold tracking-tight md:text-3xl'>
                Questions & answers
              </h2>
              <p className='text-muted-foreground mt-2 text-sm md:text-base'>
                Ask the seller or browse answers from other shoppers before you buy.
              </p>
            </div>
            <ProductQaSection productId={numericProductId} productSlug={productSlug} />
          </TabsContent>

          <TabsContent value='reviews' className='mt-10'>
            <div className='mb-8 max-w-3xl'>
              <h2 className='font-display text-2xl font-semibold tracking-tight md:text-3xl'>
                Customer reviews
              </h2>
              <p className='text-muted-foreground mt-2 text-sm md:text-base'>
                Read what shoppers say about {product.name}, or share your own experience.
              </p>
            </div>
            <ProductReviewsSection
              productId={numericProductId}
              productName={product.name ?? 'this product'}
            />
          </TabsContent>
        </Tabs>
      </section>

      <RelatedProductsSection
        productId={numericProductId}
        categoryId={product.category?.id}
        categoryName={product.category?.name}
      />
    </div>
  );
}
