'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { getProductPath } from '@/domains/product/lib/product-routes';
import { getGetHomeNewArrivalsQueryOptions } from '@/services/-home-new-arrivals-get';
import { formatPrice, mapHomeProductItem } from '~/src/domains/home/lib/home-utils';
import { toSuspenseOptions } from '~/src/lib/use-suspense-query';

export function HeroSpotlight() {
  const t = useTranslations('home');
  const { data } = useSuspenseQuery(
    toSuspenseOptions(getGetHomeNewArrivalsQueryOptions({ limit: 3 }))
  );
  const spotlight = (data?.data?.products ?? []).slice(0, 3).map(mapHomeProductItem);
  if (spotlight.length === 0) return null;
  const year = new Date().getFullYear();

  const heroImage = spotlight[0]?.images?.[0];
  const spotlightPrice = spotlight[0]?.price;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className='relative lg:col-span-6'
    >
      <div className='grid grid-cols-12 gap-3 sm:gap-4'>
        {heroImage ? (
          <div className='border-gold/20 relative col-span-7 aspect-4/5 overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl'>
            <Image
              src={heroImage}
              alt={t('common.featuredCollectionAlt')}
              fill
              priority
              sizes='(max-width: 1024px) 60vw, 35vw'
              className='object-cover'
            />
            <div className='from-foreground/70 absolute inset-0 bg-linear-to-t via-transparent to-transparent' />
            <div className='absolute right-0 bottom-0 left-0 p-4 sm:p-5'>
              <p className='text-gold text-[0.7rem] tracking-[0.25em] uppercase'>
                {t('hero.editorsPick')}
              </p>
              <p className='text-primary-foreground font-display mt-1 text-lg font-medium sm:text-xl'>
                {spotlight[0]?.name ?? t('hero.signatureEditFallback')}
              </p>
              {spotlightPrice !== undefined && (
                <p className='text-primary-foreground/90 mt-1 text-sm'>
                  {t('common.fromPrice', { price: formatPrice(spotlightPrice) })}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className='bg-muted border-gold/15 col-span-7 aspect-4/5 animate-pulse rounded-2xl border sm:rounded-3xl' />
        )}

        <div className='col-span-5 flex flex-col gap-3 sm:gap-4'>
          {spotlight.slice(1, 3).map((product, index) => {
            const image = product.images?.[0];
            if (!image) return null;
            return (
              <Link
                key={product.id ?? index}
                href={getProductPath(product)}
                className='group bg-card border-gold/15 hover:border-gold/40 relative aspect-square overflow-hidden rounded-2xl border shadow-lg transition-colors sm:rounded-3xl'
              >
                <Image
                  src={image}
                  alt={product.name ?? t('common.productAlt')}
                  fill
                  priority={index === 0}
                  sizes='25vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='from-foreground/60 absolute inset-0 bg-linear-to-t to-transparent opacity-80' />
                <p className='text-primary-foreground absolute right-3 bottom-3 left-3 line-clamp-2 text-xs font-medium sm:text-sm'>
                  {product.name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7, ease: 'backOut' }}
        className='absolute -top-3 -left-3 sm:-top-5 sm:-left-5'
      >
        <div className='relative'>
          <span className='border-gold/50 absolute inset-0 animate-ping rounded-full border' />
          <span className='bg-gold/30 absolute inset-0 animate-pulse rounded-full blur-md' />
          <div className='bg-gold text-gold-foreground relative flex h-20 w-20 flex-col items-center justify-center rounded-full text-center shadow-xl sm:h-24 sm:w-24'>
            <span className='font-display text-base leading-none font-bold sm:text-lg'>
              {t('hero.newSeasonBadge')}
            </span>
            <span className='mt-0.5 text-[0.6rem] font-semibold tracking-[0.2em] uppercase'>
              {t('hero.seasonBadgeSub', { year })}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
