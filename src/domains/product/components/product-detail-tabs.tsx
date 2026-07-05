'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { hasCustomProductVideo } from '../lib/product-media-utils';
import { ProductReviewsSection } from '../sections/product-reviews-section';
import ProductDescription from './product-description';
import { ProductQaSection } from './product-qa-section';
import { ProductSpecifications } from './product-specification';
import { ProductVideoPlayer } from './product-video-player';

const ProductChatFab = dynamic(
  () => import('./product-chat-sheet').then((module) => ({ default: module.ProductChatFab })),
  { ssr: false }
);

const ProductChatSheet = dynamic(
  () => import('./product-chat-sheet').then((module) => ({ default: module.ProductChatSheet })),
  { ssr: false }
);

interface ProductDetailTabsProps {
  product: DtoProductWithLike;
  numericProductId: number;
  productSlug: string;
}

/** Client island — tab switching, Q&A/reviews, and AI chat sheet. */
export function ProductDetailTabs({
  product,
  numericProductId,
  productSlug
}: ProductDetailTabsProps) {
  const t = useTranslations('pdp');
  const [chatOpen, setChatOpen] = useState(false);
  const showVideoTab = hasCustomProductVideo(product) || Boolean(product.is_digital);

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
    <>
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

      <ProductChatFab onClick={() => setChatOpen(true)} className='hidden lg:inline-flex' />
      <ProductChatSheet open={chatOpen} onOpenChange={setChatOpen} product={product} />
    </>
  );
}
