import { IconStar } from '@tabler/icons-react';

import { cn } from '@/lib/utils';
import { formatRating } from '~/src/domains/store/store.utils';

export function StoreRatingStars({
  rating,
  reviewCount,
  compact = false
}: {
  rating: number;
  reviewCount?: number;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <span
        className='text-muted-foreground inline-flex min-w-0 items-center gap-1 text-xs'
        aria-label={`Rated ${rating} out of 5`}
      >
        <IconStar className='fill-gold text-gold h-3.5 w-3.5 shrink-0' />
        <span className='text-foreground font-medium tabular-nums'>{formatRating(rating)}</span>
        {reviewCount !== undefined && <span className='truncate'>({reviewCount} reviews)</span>}
      </span>
    );
  }

  return (
    <div
      className={cn('inline-flex items-center gap-1 text-sm')}
      aria-label={`Rated ${rating} out of 5`}
    >
      <IconStar className='fill-gold text-gold h-3.5 w-3.5' />
      <span className='font-medium'>{formatRating(rating)}</span>
      {reviewCount !== undefined && <span className='text-muted-foreground'>({reviewCount})</span>}
    </div>
  );
}
