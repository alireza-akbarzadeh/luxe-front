'use client';
import Image from 'next/image';
import Link from 'next/link';
import { VerifiedBadge } from './verified-badge';
import { type ModelsStoreReview } from '@/domains/store/store.types';
import { IconMapPin, IconPackage, IconTruck, IconUsers } from '@tabler/icons-react';
import { FollowButton } from '@/components/buttons/follow-button';
import { StoreRatingStars } from '@/domains/store/components/store-rating-start';
import { formatCount } from '@/domains/store/store.utils';

export function StoreListItem({ store }: { store: ModelsStoreReview }) {
  return (
    <article className='group border-border bg-card flex gap-4 rounded-2xl border p-4 transition-shadow hover:shadow-md'>
      <Link
        href={`/store/${store.slug}`}
        className='bg-muted relative h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32'
      >
        <Image src={store.banner_url || ''} alt='' fill sizes='128px' className='object-cover' />
      </Link>
      <div className='flex min-w-0 flex-1 flex-col'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <div className='flex items-center gap-1.5'>
              <Link
                href={`/store/${store.slug}`}
                className='truncate text-base font-semibold hover:underline'
              >
                {store.name}
              </Link>
              {store.is_verified && <VerifiedBadge />}
            </div>
            <p className='text-muted-foreground mt-0.5 flex items-center gap-1 text-xs'>
              <IconMapPin className='h-3 w-3' /> {store.location}
            </p>
          </div>
          <FollowButton storeId={store.id as number} />
        </div>
        <p className='text-muted-foreground mt-2 line-clamp-2 text-sm'>{store.description}</p>
        <div className='text-muted-foreground mt-auto flex flex-wrap items-center gap-4 pt-3 text-xs'>
          <StoreRatingStars rating={store.rating as number} reviewCount={store.review_count} />
          <span className='inline-flex items-center gap-1'>
            <IconUsers className='h-3.5 w-3.5' /> {formatCount(store.follower_count ?? 0)} followers
          </span>
          <span className='inline-flex items-center gap-1'>
            <IconTruck className='h-3.5 w-3.5' /> {store.shippingSpeedDays}-day shipping
          </span>
          <span className='inline-flex items-center gap-1'>
            <IconPackage className='h-3.5 w-3.5' /> {store.productCount} products
          </span>
        </div>
      </div>
    </article>
  );
}
