'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { FollowButton } from '@/components/buttons/follow-button';
import { Badge } from '@/components/ui/badge';
import { StoreRatingStars } from '@/domains/store/components/store-rating-start';
import { VerifiedBadge } from '@/domains/store/components/verified-badge';
import { cardHover, fadeUp, formatCount } from '@/domains/store/store.utils';
import { IconMapPin, IconTruck, IconUsers } from '@tabler/icons-react';
import type { DtoStoreResponse } from '~/src/services/-stores-get.schemas';

export function StoreCard({ store }: { store: DtoStoreResponse }) {
  return (
    <motion.article
      variants={fadeUp}
      initial='rest'
      whileHover='hover'
      animate='rest'
      className='group border-border bg-card relative overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-xl'
    >
      <motion.div variants={cardHover} className='contents'>
        <Link
          href={`/store/${store.slug}`}
          className='focus-visible:ring-foreground block focus:outline-none focus-visible:ring-2'
        >
          <div className='bg-muted relative aspect-[16/9] w-full overflow-hidden'>
            <Image
              src={store.banner_url || ''}
              alt=''
              fill
              sizes='(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw'
              className='object-cover transition-transform duration-700 ease-out group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80' />
            {store?.badges?.length > 0 && (
              <div className='absolute top-3 left-3 flex flex-wrap gap-1.5'>
                {store?.badges?.slice(0, 2).map((b) => (
                  <Badge key={b} className='glass border-0 text-white'>
                    {b}
                  </Badge>
                ))}
              </div>
            )}
            <div className='absolute right-3 bottom-3 left-3 flex items-end gap-3'>
              <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-white/20 bg-white shadow-lg'>
                <Image
                  src={store.logo_url || ''}
                  alt={`${store.name} logo`}
                  fill
                  sizes='56px'
                  className='object-cover'
                />
              </div>
              <div className='min-w-0 flex-1 text-white'>
                <div className='flex items-center gap-1.5'>
                  <h3 className='truncate text-base font-semibold drop-shadow'>{store.name}</h3>
                  {store.is_verified && <VerifiedBadge />}
                </div>
                <p className='flex items-center gap-1 text-xs text-white/80'>
                  <IconMapPin className='h-3 w-3' /> {store.location}
                </p>
              </div>
            </div>
          </div>
        </Link>
        <div className='space-y-3 p-4'>
          <p className='text-muted-foreground line-clamp-2 text-sm'>{store.description}</p>
          <div className='flex flex-wrap gap-1.5'>
            {store?.categories?.slice(0, 3).map((c) => (
              <span
                key={c.id}
                className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs'
              >
                {c.name}
              </span>
            ))}
          </div>
          <div
            className={cn(
              'border-border text-muted-foreground flex items-center justify-between border-t pt-3 text-xs'
            )}
          >
            <span className='inline-flex items-center gap-1'>
              <IconUsers className='h-3.5 w-3.5' /> {formatCount(store.follower_count || 0)}
            </span>
            <StoreRatingStars rating={store.rating || 0} reviewCount={store.review_count} />
            <span className='inline-flex items-center gap-1'>
              <IconTruck className='h-3.5 w-3.5' /> {store.shippingSpeedDays}d
            </span>
          </div>
          <div className='flex items-center justify-between pt-1'>
            <span className='text-muted-foreground text-xs'>{store.productCount} products</span>
            <FollowButton storeId={store.id as number} />
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
