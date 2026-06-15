'use client';

import {
  IconCalendar,
  IconMapPin,
  IconPackage,
  IconShare2,
  IconStar,
  IconUsers
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { fullBleedClass, sectionContainerClass } from '@/domains/home/lib/home-utils';
import { VerifiedBadge } from '@/domains/store/components/verified-badge';
import {
  formatCount,
  resolveStoreBanner,
  resolveStoreLogo,
  type StoreEssentialsType
} from '@/domains/store/store.utils';
import { cn } from '@/lib/utils';
import { FollowButton } from '~/src/components/buttons/follow-button';
import { useSharing } from '~/src/hooks/useSharing';
import { formatDate } from '~/src/lib/date';

interface StoreHeaderProps {
  store: StoreEssentialsType;
  totalProducts: number;
}

export function StoreHeader(props: StoreHeaderProps) {
  const { store, totalProducts } = props;
  const bannerSrc = resolveStoreBanner(store.banner);
  const logoSrc = resolveStoreLogo(store.logo);
  const { share } = useSharing(store.slug ?? '', store.name ?? '');

  return (
    <section className={cn(fullBleedClass, 'relative overflow-hidden border-b')}>
      <div className='relative h-44 overflow-hidden sm:h-52 md:h-64'>
        <Image
          src={bannerSrc}
          alt={store.name ?? 'Store banner'}
          fill
          className='object-cover'
          priority
          sizes='100vw'
        />
        <div className='from-background via-background/60 absolute inset-0 bg-linear-to-t to-transparent' />
        <div className='from-gold/25 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent opacity-70' />
      </div>

      <div className={cn(sectionContainerClass, 'relative -mt-14 pb-6 sm:-mt-16 md:-mt-20')}>
        <div className='flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-6'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='border-gold/40 bg-card relative h-24 w-24 overflow-hidden rounded-2xl border-4 shadow-xl ring-4 ring-white/10 md:h-32 md:w-32'
          >
            <Image src={logoSrc} alt={store.name ?? 'Store logo'} fill className='object-cover' />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='min-w-0 flex-1'
          >
            <div className='mb-1 flex flex-wrap items-center gap-2'>
              <h1 className='font-display text-2xl font-bold md:text-4xl'>{store.name}</h1>
              {store.isVerified && <VerifiedBadge size='lg' />}
            </div>
            {store.description && (
              <p className='text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base'>
                {store.description}
              </p>
            )}

            <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
              <div className='flex items-center gap-1'>
                <IconStar className='fill-gold text-gold h-4 w-4' />
                <span className='font-medium'>{store.rating}</span>
                <span className='text-muted-foreground'>({store.reviewCount} reviews)</span>
              </div>
              <div className='text-muted-foreground flex items-center gap-1'>
                <IconPackage className='h-4 w-4' />
                <span>{totalProducts.toLocaleString('en-US')} products</span>
              </div>
              <div className='text-muted-foreground flex items-center gap-1'>
                <IconUsers className='h-4 w-4' />
                <span>{formatCount(store.followerCount ?? 0)} followers</span>
              </div>
              {store.location && (
                <div className='text-muted-foreground flex items-center gap-1'>
                  <IconMapPin className='h-4 w-4' />
                  <span>{store.location}</span>
                </div>
              )}
              {store.joinedDate && (
                <div className='text-muted-foreground flex items-center gap-1'>
                  <IconCalendar className='h-4 w-4' />
                  <span>Since {formatDate(new Date(store.joinedDate as string), '')}</span>
                </div>
              )}
            </div>

            {store.categories && store.categories.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-1.5'>
                {store.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className='border-gold/25 bg-gold/10 text-gold-strong dark:text-gold rounded-full border px-2.5 py-0.5 text-xs font-medium'
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='mt-2 flex w-full items-center gap-2 md:mt-0 md:w-auto'
          >
            <FollowButton
              isFollowed={store.isFollowed ?? false}
              slug={store.slug ?? ''}
              storeName={store.name ?? undefined}
              className='flex-1 md:flex-none'
            />
            <Button
              variant='outline'
              size='icon'
              onClick={share}
              className='border-gold/30 hover:border-gold shrink-0 rounded-full'
              aria-label='Share store'
            >
              <IconShare2 className='h-4 w-4' />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
