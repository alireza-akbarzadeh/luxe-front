'use client';

import {
  IconArrowUpRight,
  IconMapPin,
  IconPackage,
  IconTruck,
  IconUsers
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { FollowButton } from '@/components/buttons/follow-button';
import { StoreRatingStars } from '@/domains/store/components/store-rating-start';
import { VerifiedBadge } from '@/domains/store/components/verified-badge';
import {
  cardHover,
  fadeUp,
  formatCount,
  mapStoreToView,
  resolveStoreBanner,
  resolveStoreLogo
} from '@/domains/store/store.utils';
import { cn } from '@/lib/utils';
import type { DtoStoreResponse } from '~/src/services/-stores-get.schemas';

function StoreStat({
  icon: Icon,
  value,
  label
}: {
  icon: typeof IconUsers;
  value: string;
  label: string;
}) {
  return (
    <span className='text-muted-foreground inline-flex min-w-0 items-center gap-1.5 text-xs'>
      <Icon className='text-gold h-3.5 w-3.5 shrink-0' aria-hidden />
      <span className='text-foreground font-medium tabular-nums'>{value}</span>
      <span className='truncate'>{label}</span>
    </span>
  );
}

export function StoreCard({ store: storeData }: { store: DtoStoreResponse }) {
  const store = mapStoreToView(storeData);
  const bannerSrc = resolveStoreBanner(store.banner_url);
  const logoSrc = resolveStoreLogo(store.logo_url);

  const secondaryBadges = store.badges?.filter((b) => b !== 'Verified') ?? [];

  return (
    <motion.article
      variants={fadeUp}
      initial='rest'
      whileHover='hover'
      animate='rest'
      className='group border-gold/12 bg-card hover:border-gold/30 relative flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg'
    >
      <motion.div variants={cardHover} className='flex h-full flex-col'>
        {/* Banner */}
        <Link
          href={`/store/${store.slug}`}
          className='focus-visible:ring-gold relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
        >
          <div className='bg-muted relative aspect-[5/3] w-full overflow-hidden'>
            <Image
              src={bannerSrc}
              alt=''
              fill
              sizes='(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw'
              className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]'
            />
            <div className='from-foreground/70 via-foreground/15 absolute inset-0 bg-linear-to-t to-transparent' />

            <div className='absolute top-4 left-4 flex flex-wrap gap-2'>
              {store.is_verified && <VerifiedBadge showLabel size='sm' />}
              {secondaryBadges.slice(0, 1).map((b) => (
                <span
                  key={b}
                  className='border-gold/25 bg-gold/90 text-gold-foreground rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm'
                >
                  {b}
                </span>
              ))}
            </div>

            <span className='bg-card/92 text-foreground absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100'>
              Visit store
              <IconArrowUpRight className='h-3.5 w-3.5' />
            </span>
          </div>
        </Link>

        {/* Identity — logo overlaps banner */}
        <div className='relative px-5'>
          <div className='-mt-7 flex items-end gap-4'>
            <Link
              href={`/store/${store.slug}`}
              className='border-gold/25 dark:ring-card relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-2xl border-[3px] bg-white shadow-md ring-4 ring-white'
            >
              <Image
                src={logoSrc}
                alt={`${store.name} logo`}
                fill
                sizes='72px'
                className='object-cover'
              />
            </Link>

            <div className='min-w-0 flex-1 pb-1'>
              <div className='flex items-center gap-2'>
                <Link
                  href={`/store/${store.slug}`}
                  className='font-display truncate text-lg leading-tight font-semibold hover:underline'
                >
                  {store.name}
                </Link>
                {store.is_verified && <VerifiedBadge size='sm' />}
              </div>
              {store.location && (
                <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
                  <IconMapPin className='h-3.5 w-3.5 shrink-0' />
                  <span className='truncate'>{store.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className='flex flex-1 flex-col px-5 pt-4 pb-5'>
          {store.description && (
            <p className='text-muted-foreground line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed'>
              {store.description}
            </p>
          )}

          {store.categories && store.categories.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {store.categories.slice(0, 3).map((c) => (
                <span
                  key={c.id}
                  className='border-gold/15 bg-surface/80 text-muted-foreground rounded-full border px-3 py-1 text-xs'
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}

          {/* Stats — single relaxed row */}
          <div
            className={cn(
              'border-gold/10 mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4',
              !store.description && !store.categories?.length && 'mt-4'
            )}
          >
            <StoreStat
              icon={IconUsers}
              value={formatCount(store.follower_count || 0)}
              label='followers'
            />
            <span className='bg-border hidden h-3 w-px sm:block' aria-hidden />
            <StoreRatingStars rating={store.rating || 0} reviewCount={store.review_count} compact />
            <span className='bg-border hidden h-3 w-px sm:block' aria-hidden />
            <StoreStat icon={IconTruck} value={`${store.shippingSpeedDays}d`} label='shipping' />
            <span className='bg-border hidden h-3 w-px sm:block' aria-hidden />
            <StoreStat
              icon={IconPackage}
              value={store.productCount.toLocaleString('en-US')}
              label='products'
            />
          </div>

          {/* Footer action */}
          <div className='mt-5 flex items-center justify-end'>
            <FollowButton
              slug={store.slug ?? ''}
              storeName={store.name ?? undefined}
              isFollowed={store.is_followed ?? false}
            />
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
