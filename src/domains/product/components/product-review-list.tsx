'use client';

import { IconCheck, IconStar } from '@tabler/icons-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type {
  ProductReviewResponse,
  ProductReviewsListResponse,
  ProductReviewSummary
} from '@/domains/product/types/product-review.types';
import {
  StoreReviewItemsSkeleton,
  StoreReviewListSkeleton
} from '@/domains/store/components/store-skeleton-loading';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import { getReviews, useGetReviews } from '@/services/-reviews-get';

const PAGE_SIZE = 10;

function RatingBreakdown({ summary }: { summary?: ProductReviewSummary }) {
  const t = useTranslations('pdp.reviews');
  const { formatDecimal, formatInteger, moneyClassName } = useLocaleFormatters();
  const total = summary?.total ?? 0;
  const average = summary?.average ?? 0;

  return (
    <div className='border-border/60 bg-card rounded-2xl border p-6'>
      <p className={cn('font-display text-5xl', moneyClassName)}>{formatDecimal(average)}</p>
      <div className='mt-2 flex'>
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            className={cn(
              'h-4 w-4',
              i < Math.round(average)
                ? 'fill-foreground text-foreground'
                : 'text-muted-foreground/35'
            )}
          />
        ))}
      </div>
      <p className='text-muted-foreground mt-2 text-sm'>
        {t('basedOn', { count: total })}
      </p>

      <div className='mt-6 space-y-1.5'>
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = summary?.counts?.[String(stars)] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={stars} className='flex items-center gap-2 text-xs'>
              <span className='text-muted-foreground w-12'>
                {t('starLabel', { stars })}
              </span>
              <div className='bg-muted h-1.5 flex-1 overflow-hidden rounded-full'>
                <div className='bg-foreground h-full transition-all' style={{ width: `${pct}%` }} />
              </div>
              <span className={cn('text-muted-foreground w-8 text-end', moneyClassName)}>
                {formatInteger(pct)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewItem({ review }: { review: ProductReviewResponse }) {
  const t = useTranslations('pdp.reviews');
  const formatter = useFormatter();

  return (
    <li className='border-border border-b pb-6 last:border-0'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='font-medium'>{review.author || t('anonymous')}</p>
            {review.is_verified && (
              <Badge variant='outline' className='gap-1 text-[10px]'>
                <IconCheck className='h-2.5 w-2.5' /> {t('verifiedPurchase')}
              </Badge>
            )}
            {review.is_owner && (
              <span className='text-accent text-[11px] font-medium'>{t('yourReview')}</span>
            )}
          </div>
        </div>
        {review.created_at && (
          <p className='text-muted-foreground shrink-0 text-xs'>
            {formatter.relativeTime(new Date(review.created_at))}
          </p>
        )}
      </div>
      <div className='mt-2 flex'>
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < Number(review.rating ?? 0)
                ? 'fill-foreground text-foreground'
                : 'text-muted-foreground/35'
            )}
          />
        ))}
      </div>
      {review.title && <p className='mt-2 font-medium'>{review.title}</p>}
      {review.comment && (
        <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>{review.comment}</p>
      )}
    </li>
  );
}

interface ProductReviewListProps {
  productId: number;
}

export function ProductReviewList({ productId }: ProductReviewListProps) {
  const t = useTranslations('pdp.reviews');
  const [extraReviews, setExtraReviews] = useState<ProductReviewResponse[]>([]);
  const [nextOffset, setNextOffset] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading } = useGetReviews({
    product_id: productId,
    limit: PAGE_SIZE,
    offset: 0
  });

  const listData = (data as ProductReviewsListResponse | undefined)?.data;
  const firstPageReviews = listData?.reviews ?? [];
  const total = listData?.total ?? 0;
  const summary = listData?.summary;
  const reviews = [...firstPageReviews, ...extraReviews];
  const hasMore = reviews.length < total;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const response = (await getReviews({
        product_id: productId,
        limit: PAGE_SIZE,
        offset: nextOffset
      })) as ProductReviewsListResponse;
      const page = response.data?.reviews ?? [];
      setExtraReviews((current) => {
        const existingIds = new Set([...firstPageReviews, ...current].map((review) => review.id));
        const next = page.filter((review) => review.id && !existingIds.has(review.id));
        return [...current, ...next];
      });
      setNextOffset((current) => current + PAGE_SIZE);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return <StoreReviewListSkeleton />;
  }

  return (
    <div className='space-y-8'>
      <RatingBreakdown summary={summary} />

      {reviews.length > 0 ? (
        <>
          <ul className='space-y-6'>
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ul>
          {hasMore && (
            <div className='flex flex-col items-center gap-6'>
              {isLoadingMore ? <StoreReviewItemsSkeleton itemCount={2} /> : null}
              <Button
                variant='outline'
                className='rounded-full px-8'
                disabled={isLoadingMore}
                onClick={() => void handleLoadMore()}
              >
                {t('loadMore')}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className='text-muted-foreground py-8 text-center'>{t('empty')}</p>
      )}
    </div>
  );
}
