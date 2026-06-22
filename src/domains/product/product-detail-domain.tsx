'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';
import { useGetProductsId } from '~/src/services/-products-{id}-get';

import { ProductAlternativesSection } from './components/product-alternatives-section';
import {
  ProductChatFab,
  ProductChatSheet
} from './components/product-chat-sheet';
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
  const t = useTranslations('pdp');
  const [chatOpen, setChatOpen] = useState(false);
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
    { label: t('breadcrumb.shop'), href: '/shop' },
    ...(product.store?.slug
      ? [{ label: product.store.name ?? t('breadcrumb.store'), href: `/store/${product.store.slug}` }]
      : []),
    ...(product.category?.name
      ? [{ label: product.category.name, href: `/shop?categoryId=${product.category.id ?? ''}` }]
      : []),
    { label: product.name || t('breadcrumb.product') }
  ];

  const tabs = [
    { value: 'description', label: t('tabs.description') },
    ...(showVideoTab ? [{ value: 'video' as const, label: t('tabs.video') }] : []),
    { value: 'details', label: t('tabs.details') },
    { value: 'qa', label: t('tabs.qa') },
    {
      value: 'reviews',
      label: t('tabs.reviews', { count: product.reviews_count ?? 0 })
    }
  ];

  return (
    <div className='app-container mt-20 pb-16'>
      <DynamicBreadcrumb
        items={breadcrumbItems}
        homeLabel={t('breadcrumb.home')}
        direction='column'
        separator={<IconChevronRight className={cn('h-3 w-3', 'cn-rtl-flip')} />}
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
            <h2 className='font-display mb-4 text-2xl font-semibold'>{t('aboutTitle')}</h2>
            <ProductDescription description={product.description || ''} tags={product.tags} />
          </TabsContent>

          {showVideoTab && (
            <TabsContent value='video' className='mt-10 max-w-3xl'>
              <h2 className='font-display mb-4 text-2xl font-semibold'>{t('videoTitle')}</h2>
              <p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
                {t('videoDescription')}
              </p>
              <ProductVideoPlayer product={product} className='max-w-2xl' />
            </TabsContent>
          )}

          <TabsContent value='details' id='product-specs' className='mt-10 max-w-4xl scroll-mt-28'>
            <h2 className='font-display mb-4 text-2xl font-semibold'>{t('detailsTitle')}</h2>
            <div className='border-border/60 bg-card rounded-2xl border p-6 sm:p-8'>
              <ProductSpecifications product={product} />
            </div>
          </TabsContent>

          <TabsContent value='qa' className='mt-10 max-w-3xl'>
            <div className='mb-8'>
              <h2 className='font-display text-2xl font-semibold tracking-tight md:text-3xl'>
                {t('qaTitle')}
              </h2>
              <p className='text-muted-foreground mt-2 text-sm md:text-base'>{t('qaIntro')}</p>
            </div>
            <ProductQaSection productId={numericProductId} productSlug={productSlug} />
          </TabsContent>

          <TabsContent value='reviews' className='mt-10'>
            <div className='mb-8 max-w-3xl'>
              <h2 className='font-display text-2xl font-semibold tracking-tight md:text-3xl'>
                {t('reviewsTitle')}
              </h2>
              <p className='text-muted-foreground mt-2 text-sm md:text-base'>
                {t('reviewsIntro', { name: product.name ?? t('thisProduct') })}
              </p>
            </div>
            <ProductReviewsSection
              productId={numericProductId}
              productName={product.name ?? t('thisProduct')}
            />
          </TabsContent>
        </Tabs>
      </section>

      <RelatedProductsSection
        productId={numericProductId}
        categoryId={product.category?.id}
        categoryName={product.category?.name}
      />

      <ProductChatFab onClick={() => setChatOpen(true)} />
      <ProductChatSheet open={chatOpen} onOpenChange={setChatOpen} product={product} />
    </div>
  );
}
