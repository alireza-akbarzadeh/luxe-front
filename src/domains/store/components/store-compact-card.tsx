'use client';

import { IconUsers } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { type ModelsStoreReview } from '@/domains/store/store.types';
import { FollowButton } from '~/src/components/buttons/follow-button';
import { StoreRatingStars } from '~/src/domains/store/components/store-rating-start';
import { VerifiedBadge } from '~/src/domains/store/components/verified-badge';
import { formatCount, resolveStoreLogo } from '~/src/domains/store/store.utils';

export function StoreCardCompact({ store }: { store: ModelsStoreReview }) {
  const logoSrc = resolveStoreLogo(store.logo_url);

  return (
    <article className='group border-gold/15 bg-card hover:border-gold/35 flex items-center gap-3 rounded-xl border p-3 transition-colors hover:shadow-md'>
      <Link
        href={`/store/${store.slug}`}
        className='border-gold/20 relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border'
      >
        <Image
          src={logoSrc}
          alt={`${store.name} logo`}
          fill
          sizes='56px'
          className='object-cover transition-transform group-hover:scale-105'
        />
      </Link>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-1.5'>
          <Link
            href={`/store/${store.slug}`}
            className='hover:text-gold-strong dark:hover:text-gold truncate font-medium'
          >
            {store.name}
          </Link>
          {store.is_verified && <VerifiedBadge />}
        </div>
        <div className='text-muted-foreground mt-0.5 flex items-center gap-3 text-xs'>
          <StoreRatingStars rating={store.rating ?? 0} />
          <span className='inline-flex items-center gap-1'>
            <IconUsers className='text-gold h-3 w-3' />
            {formatCount(store.follower_count ?? 0)}
          </span>
        </div>
      </div>
      <FollowButton
        slug={store.slug ?? ''}
        storeName={store.name ?? undefined}
        isFollowed={store.is_followed ?? false}
        size='sm'
      />
    </article>
  );
}
