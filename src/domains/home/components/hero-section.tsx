'use client';

import { IconArrowRight, IconSparkles, IconStar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { cn } from '@/lib/utils';
import { useGetProducts } from '~/src/services/-products-get';

import { HERO_FALLBACK_IMAGE, HERO_TRUST_AVATARS, HOME_STATS } from '../lib/home-mock-data';
import {
  formatPrice,
  fullBleedClass,
  resolveProducts,
  sectionContainerClass
} from '../lib/home-utils';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
};

export function HeroSection() {
  const { data } = useGetProducts({
    status: 'active',
    limit: 3,
    offset: 0,
    sort: 'newest'
  });

  const spotlight = resolveProducts(data?.data?.products).slice(0, 3);
  const heroImage = spotlight[0]?.images?.[0] ?? HERO_FALLBACK_IMAGE;
  const spotlightPrice = spotlight[0]?.price;

  return (
    <section className={`${fullBleedClass} relative overflow-hidden`}>
      {/* Warm luxury base wash */}
      <div className='from-background via-background to-surface absolute inset-0 bg-linear-to-b' />

      {/* Gold geometric glow accents */}
      <div className='bg-gold/10 dark:bg-gold/15 pointer-events-none absolute -top-32 right-0 h-112 w-md rounded-full blur-3xl' />
      <div className='bg-gold/8 pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl' />

      {/* Subtle geometric grid pattern in accent tone */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]'
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)'
        }}
      />

      <div
        className={`${sectionContainerClass} relative flex min-h-[calc(100svh-5rem)] flex-col justify-center pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24`}
      >
        <div className='grid items-center gap-10 lg:grid-cols-12 lg:gap-14'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='show'
            className='text-center lg:col-span-6 lg:text-left'
          >
            <motion.div
              variants={itemVariants}
              className='border-gold/30 bg-card/80 text-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm sm:text-sm'
            >
              <IconSparkles className='text-gold h-4 w-4' />
              <span className='text-gold-strong dark:text-gold tracking-wide'>
                Spring / Summer 2026
              </span>
              <span className='text-muted-foreground'>— Now live</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className='font-display text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-[5.25rem]'
            >
              Curated luxury for
              <span className='text-gold-gradient mt-1 block italic'>everyday life</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className='text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0'
            >
              Discover designer-grade fashion, home, and lifestyle from verified independent stores
              — curated for quality, sustainability, and timeless style.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className='mt-6 flex flex-col items-center gap-3 sm:flex-row lg:items-start'
            >
              <div className='flex -space-x-2'>
                {HERO_TRUST_AVATARS.map((src, i) => (
                  <div
                    key={src}
                    className='border-background relative size-9 overflow-hidden rounded-full border-2 sm:size-10'
                    style={{ zIndex: HERO_TRUST_AVATARS.length - i }}
                  >
                    <Image src={src} alt='' fill className='object-cover' sizes='40px' />
                  </div>
                ))}
              </div>
              <div className='text-center sm:text-left'>
                <div className='flex items-center justify-center gap-1 sm:justify-start'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar
                      key={i}
                      className='fill-gold text-gold size-3.5 sm:size-4'
                      aria-hidden
                    />
                  ))}
                  <span className='ml-1 text-sm font-semibold'>4.9</span>
                </div>
                <p className='text-muted-foreground text-xs sm:text-sm'>
                  Trusted by 50,000+ shoppers
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row lg:justify-start'
            >
              <Link
                href='/shop'
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'group h-12 rounded-full px-8 text-base shadow-lg sm:h-14'
                )}
              >
                Shop new arrivals
                <IconArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='border-gold/40 hover:border-gold hover:text-gold-strong dark:hover:text-gold bg-card/50 h-12 rounded-full px-8 text-base backdrop-blur-sm transition-colors sm:h-14'
                asChild
              >
                <Link href='/collection'>Explore collections</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className='border-gold/15 mt-12 grid grid-cols-2 gap-y-6 border-t pt-8 sm:grid-cols-4 lg:gap-6'
            >
              {HOME_STATS.map((stat) => (
                <dl key={stat.label} className='text-left'>
                  <dt className='font-display text-2xl font-semibold sm:text-3xl'>{stat.value}</dt>
                  <dd className='text-muted-foreground mt-1 text-xs tracking-wide sm:text-sm'>
                    {stat.label}
                  </dd>
                </dl>
              ))}
            </motion.div>
            <motion.p
              variants={itemVariants}
              className='text-muted-foreground/80 mt-3 text-[11px] tracking-wide'
            >
              Marketplace highlights · updated seasonally
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className='relative lg:col-span-6'
          >
            <div className='grid grid-cols-12 gap-3 sm:gap-4'>
              <div className='border-gold/20 relative col-span-7 aspect-4/5 overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl'>
                <Image
                  src={heroImage}
                  alt='Featured collection'
                  fill
                  priority
                  sizes='(max-width: 1024px) 60vw, 35vw'
                  className='object-cover'
                />
                <div className='from-foreground/70 absolute inset-0 bg-linear-to-t via-transparent to-transparent' />
                <div className='absolute right-0 bottom-0 left-0 p-4 sm:p-5'>
                  <p className='text-gold text-[0.7rem] tracking-[0.25em] uppercase'>
                    Editor&apos;s pick
                  </p>
                  <p className='text-primary-foreground font-display mt-1 text-lg font-medium sm:text-xl'>
                    {spotlight[0]?.name ?? 'The Signature Edit'}
                  </p>
                  {spotlightPrice !== undefined && (
                    <p className='text-primary-foreground/90 mt-1 text-sm'>
                      From {formatPrice(spotlightPrice)}
                    </p>
                  )}
                </div>
              </div>

              <div className='col-span-5 flex flex-col gap-3 sm:gap-4'>
                {spotlight.slice(1, 3).map((product, index) => (
                  <Link
                    key={product?.id ?? index}
                    href={product ? getProductPath(product) : '/shop'}
                    className='group bg-card border-gold/15 hover:border-gold/40 relative aspect-square overflow-hidden rounded-2xl border shadow-lg transition-colors sm:rounded-3xl'
                  >
                    <Image
                      src={product?.images?.[0] ?? HERO_FALLBACK_IMAGE}
                      alt={product?.name ?? 'Product'}
                      fill
                      priority={index === 0}
                      sizes='25vw'
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                    <div className='from-foreground/60 absolute inset-0 bg-linear-to-t to-transparent opacity-80' />
                    <p className='text-primary-foreground absolute right-3 bottom-3 left-3 line-clamp-2 text-xs font-medium sm:text-sm'>
                      {product?.name}
                    </p>
                  </Link>
                ))}

                {spotlight.length < 3 &&
                  [0, 1].slice(0, 3 - spotlight.length).map((i) => (
                    <div
                      key={`placeholder-${i}`}
                      className='bg-muted border-gold/15 relative aspect-square overflow-hidden rounded-2xl border sm:rounded-3xl'
                    >
                      <Image
                        src={HERO_FALLBACK_IMAGE}
                        alt='Collection preview'
                        fill
                        className='object-cover opacity-60'
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Floating product badge with animated pulse ring */}
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
                    New
                  </span>
                  <span className='mt-0.5 text-[0.6rem] font-semibold tracking-[0.2em] uppercase'>
                    Season
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
