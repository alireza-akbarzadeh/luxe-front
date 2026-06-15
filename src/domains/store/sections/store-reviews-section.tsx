'use client';

import { StoreReviewForm } from '@/domains/store/components/store-review-form';
import { StoreReviewList } from '@/domains/store/components/store-review-list';

interface StoreReviewsSectionProps {
  slug: string;
  storeName: string;
}

/** Store reviews — summary, list, and authenticated write/edit form. */
export function StoreReviewsSection({ slug, storeName }: StoreReviewsSectionProps) {
  return (
    <section id='store-reviews' className='border-gold/10 mt-16 border-t pt-12'>
      <div className='mb-8'>
        <h2 className='font-display text-2xl font-semibold tracking-tight md:text-3xl'>
          Customer reviews
        </h2>
        <p className='text-muted-foreground mt-2 text-sm md:text-base'>
          Read what shoppers say about {storeName}, or share your own experience.
        </p>
      </div>

      <div className='grid gap-10 xl:grid-cols-[minmax(0,360px)_1fr] xl:gap-12'>
        <StoreReviewForm slug={slug} />
        <StoreReviewList slug={slug} />
      </div>
    </section>
  );
}
