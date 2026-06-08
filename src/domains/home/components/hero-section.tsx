'use client';

import { IconArrowRight, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGetProducts } from '~/src/services/-products-get';

import { HERO_FALLBACK_IMAGE, HOME_STATS } from '../lib/home-mock-data';
import {
  formatPrice,
  fullBleedClass,
  resolveProducts,
  sectionContainerClass
} from '../lib/home-utils';

export function HeroSection() {
  const { data } = useGetProducts({
    status: 'active',
    limit: 3,
    offset: 0,
    sort: 'newest'
  });

  const spotlight = resolveProducts(data?.data?.products).slice(0, 3);
  const heroImage = spotlight[0]?.images?.[0] ?? HERO_FALLBACK_IMAGE;

  return (
    <section className={`${fullBleedClass} relative overflow-hidden`}>
      <div className='from-background via-background to-secondary/30 absolute inset-0 bg-linear-to-b' />
      <div className='bg-accent/8 dark:bg-accent/12 pointer-events-none absolute -top-32 right-0 h-112 w-md rounded-full blur-3xl' />
      <div className='bg-accent/5 pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl' />

      <div
        className={`${sectionContainerClass} relative pt-6 pb-16 sm:pt-10 sm:pb-20 lg:pt-14 lg:pb-28`}
      >
        <div className='grid items-center gap-10 lg:grid-cols-12 lg:gap-14'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className='text-center lg:col-span-6 lg:text-left'
          >
            <div className='border-border/60 bg-card/80 text-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm sm:text-sm'>
              <IconSparkles className='text-accent h-4 w-4' />
              Spring / Summer 2026 — Now live
            </div>

            <h1 className='font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl'>
              Curated luxury for
              <span className='text-accent block sm:inline sm:pl-3'>everyday life</span>
            </h1>

            <p className='text-muted-foreground mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0'>
              Discover designer-grade fashion, home, and lifestyle pieces — handpicked for quality,
              sustainability, and timeless style.
            </p>

            <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start'>
              <Link
                href='/shop'
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'group h-12 rounded-full px-8 text-base sm:h-14'
                )}
              >
                Shop new arrivals
                <IconArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='border-border/80 bg-card/50 h-12 rounded-full px-8 text-base backdrop-blur-sm sm:h-14'
                asChild
              >
                <Link href='/shop?sortBy=rating'>Best sellers</Link>
              </Button>
            </div>

            <dl className='mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6'>
              {HOME_STATS.map((stat) => (
                <div key={stat.label} className='text-left'>
                  <dt className='font-display text-xl font-semibold sm:text-2xl'>{stat.value}</dt>
                  <dd className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className='lg:col-span-6'
          >
            <div className='grid grid-cols-12 gap-3 sm:gap-4'>
              <div className='relative col-span-7 aspect-4/5 overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl'>
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
                  <p className='text-primary-foreground/80 text-xs tracking-widest uppercase'>
                    Editor&apos;s pick
                  </p>
                  <p className='text-primary-foreground font-display mt-1 text-lg font-medium sm:text-xl'>
                    {spotlight[0]?.name ?? 'The Signature Edit'}
                  </p>
                  {spotlight[0]?.price !== undefined && (
                    <p className='text-primary-foreground/90 mt-1 text-sm'>
                      From {formatPrice(spotlight[0].price)}
                    </p>
                  )}
                </div>
              </div>

              <div className='col-span-5 flex flex-col gap-3 sm:gap-4'>
                {spotlight.slice(1, 3).map((product, index) => (
                  <Link
                    key={product?.id ?? index}
                    href={product?.id ? `/product/${product.id}` : '/shop'}
                    className='group bg-card border-border/60 relative aspect-square overflow-hidden rounded-2xl border shadow-lg sm:rounded-3xl'
                  >
                    <Image
                      src={product?.images?.[0] ?? HERO_FALLBACK_IMAGE}
                      alt={product?.name ?? 'Product'}
                      fill
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
                      className='bg-muted border-border/40 relative aspect-square overflow-hidden rounded-2xl border sm:rounded-3xl'
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
