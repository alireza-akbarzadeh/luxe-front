'use client';
import { IconUsers } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from '~/src/components/buttons/follow-button';
import { StoreRatingStars } from '~/src/domains/store/components/store-rating-start';
import { VerifiedBadge } from '~/src/domains/store/components/verified-badge';
import { formatCount } from '~/src/domains/store/store.utils';
import { type ModelsStoreReview } from '@/domains/store/store.types';

export function StoreCardCompact({ store }: { store: ModelsStoreReview }) {
  return (
    <article className='group border-border bg-card hover:bg-muted/40 flex items-center gap-3 rounded-xl border p-3 transition-colors'>
      <Link
        href={`/store/${store.slug}`}
        className='relative h-14 w-14 shrink-0 overflow-hidden rounded-lg'
      >
        <Image
          src={store.logo_url || ''}
          alt={`${store.name} logo`}
          fill
          sizes='56px'
          className='object-cover'
        />
      </Link>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-1.5'>
          <Link href={`/store/${store.slug}`} className='truncate font-medium hover:underline'>
            {store.name}
          </Link>
          {store.is_verified && <VerifiedBadge />}
        </div>
        <div className='text-muted-foreground flex items-center gap-3 text-xs'>
          <StoreRatingStars rating={store.rating ?? 0} />
          <span className='inline-flex items-center gap-1'>
            <IconUsers className='h-3 w-3' /> {formatCount(store.follower_count ?? 0)}
          </span>
        </div>
      </div>
      <FollowButton slug={store.slug ?? ''} isFollowed={store.is_followed ?? false} />
    </article>
  );
}
