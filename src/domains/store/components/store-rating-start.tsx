import { IconStar } from '@tabler/icons-react';

import { formatRating } from '~/src/domains/store/store.utils';

export function StoreRatingStars({
  rating,
  reviewCount
}: {
  rating: number;
  reviewCount?: number;
}) {
  return (
    <div className='inline-flex items-center gap-1 text-sm' aria-label={`Rated ${rating} out of 5`}>
      <IconStar className='h-3.5 w-3.5 fill-amber-400 stroke-amber-400' />
      <span className='font-medium'>{formatRating(rating)}</span>
      {reviewCount !== undefined && <span className='text-muted-foreground'>({reviewCount})</span>}
    </div>
  );
}
