'use client';

import { IconStar } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { StoreReviewListSkeleton } from '@/domains/store/components/store-skeleton-loading';
import type {
  StoreReviewResponse,
  StoreReviewsListResponse,
  StoreReviewSummary} from '@/domains/store/types/store-review.types';
import { cn } from '@/lib/utils';
import {
  getStoresSlugReviews,
  useGetStoresSlugReviews
} from '@/services/-stores-{slug}-reviews-get';

const PAGE_SIZE = 10;

function RatingBreakdown({ summary }: { summary?: StoreReviewSummary }) {
  const total = summary?.total ?? 0;
  const average = summary?.average ?? 0;

  return (
    <div className='border-gold/10 bg-card rounded-2xl border p-6'>
      <p className='font-display text-5xl tabular-nums'>{average.toFixed(1)}</p>
      <div className='mt-2 flex'>
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            className={cn(
              'h-4 w-4',
              i < Math.round(average) ? 'fill-gold text-gold' : 'text-muted-foreground/35'
            )}
          />
        ))}
      </div>
      <p className='text-muted-foreground mt-2 text-sm'>
        Based on {total.toLocaleString('en-US')} review{total === 1 ? '' : 's'}
      </p>

      <div className='mt-6 space-y-1.5'>
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = summary?.counts?.[String(stars)] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={stars} className='flex items-center gap-2 text-xs'>
              <span className='text-muted-foreground w-12'>{stars} star</span>
              <div className='bg-muted h-1.5 flex-1 overflow-hidden rounded-full'>
                <div className='bg-gold h-full transition-all' style={{ width: `${pct}%` }} />
              </div>
              <span className='text-muted-foreground w-8 text-right tabular-nums'>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewItem({ review }: { review: StoreReviewResponse }) {
  return (
    <li className='border-gold/10 border-b pb-6 last:border-0'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-medium'>{review.author || 'Anonymous'}</p>
          {review.is_owner && (
            <span className='text-gold-strong dark:text-gold text-[11px] font-medium'>
              Your review
            </span>
          )}
        </div>
        {review.created_at && (
          <p className='text-muted-foreground shrink-0 text-xs'>
            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
          </p>
        )}
      </div>
      <div className='mt-2 flex'>
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < Number(review.rating ?? 0) ? 'fill-gold text-gold' : 'text-muted-foreground/35'
            )}
          />
        ))}
      </div>
      {review.comment && (
        <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{review.comment}</p>
      )}
    </li>
  );
}

interface StoreReviewListProps {
  slug: string;
}

export function StoreReviewList({ slug }: StoreReviewListProps) {
  const [extraReviews, setExtraReviews] = useState<StoreReviewResponse[]>([]);
  const [nextOffset, setNextOffset] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading } = useGetStoresSlugReviews(slug, {
    limit: PAGE_SIZE,
    offset: 0
  });

  const listData = (data as StoreReviewsListResponse | undefined)?.data;
  const firstPageReviews = listData?.reviews ?? [];
  const total = listData?.total ?? 0;
  const summary = listData?.summary;
  const reviews = [...firstPageReviews, ...extraReviews];
  const hasMore = reviews.length < total;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const response = (await getStoresSlugReviews(slug, {
        limit: PAGE_SIZE,
        offset: nextOffset
      })) as StoreReviewsListResponse;
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
              {isLoadingMore ? <StoreReviewListSkeleton itemCount={2} /> : null}
              <Button
                variant='outline'
                className='rounded-full px-8'
                disabled={isLoadingMore}
                onClick={() => void handleLoadMore()}
              >
                Load more reviews
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className='text-muted-foreground py-8 text-center'>
          No reviews yet. Be the first to share your experience!
        </p>
      )}
    </div>
  );
}
