'use client';

import { IconChevronLeft, IconChevronRight, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { fullBleedClass, sectionContainerClass } from '@/domains/home/lib/home-utils';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';

export type ProductsHeroVariant = 'default' | 'best-sellers';

interface ProductsHeroProps {
  total: number;
  loadedCount: number;
  isFetching: boolean;
  variant?: ProductsHeroVariant;
}

const PROMO_SLIDES = [
  {
    id: 'summer',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=900&fit=crop&q=80',
    href: '/products?showOnlySale=true'
  },
  {
    id: 'essentials',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=900&fit=crop&q=80',
    href: '/products?sortBy=newest&showOnlyNew=true'
  }
] as const;

export function ProductsHero({
  total,
  loadedCount,
  isFetching,
  variant = 'default'
}: ProductsHeroProps) {
  const t = useTranslations('products.hero');
  const { formatInteger } = useLocaleFormatters();
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = PROMO_SLIDES[slideIndex] ?? PROMO_SLIDES[0];
  const isBestSellers = variant === 'best-sellers';

  return (
    <section
      className={cn(
        fullBleedClass,
        'from-secondary/50 via-background to-background relative overflow-hidden border-b bg-linear-to-br'
      )}
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-40'
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 15% 20%, color-mix(in oklab, var(--accent) 35%, transparent) 0%, transparent 50%), radial-gradient(ellipse at 85% 10%, color-mix(in oklab, var(--primary) 20%, transparent) 0%, transparent 45%)'
        }}
      />

      <div
        className={cn(
          sectionContainerClass,
          'relative pt-8 pb-10 sm:pt-10 md:pb-12 lg:pt-12 lg:pb-14'
        )}
      >
        <Breadcrumb className='mb-6'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/'>{t('breadcrumbHome')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {isBestSellers ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href='/products'>{t('breadcrumbProducts')}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('bestSellers.breadcrumb')}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{t('title')}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className='grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className='flex flex-col justify-center'
          >
            <div className='bg-background/80 text-muted-foreground mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm'>
              <IconSparkles className='h-3.5 w-3.5' />
              {isBestSellers ? t('bestSellers.eyebrow') : t('eyebrow')}
            </div>

            <h1 className='font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
              {isBestSellers ? t('bestSellers.title') : t('title')}
            </h1>
            <p className='text-muted-foreground mt-4 max-w-xl text-base md:text-lg'>
              {isBestSellers ? t('bestSellers.description') : t('description')}
            </p>

            <div className='text-muted-foreground mt-6 flex flex-wrap items-center gap-3 text-sm'>
              <span className='bg-background/85 border-border/60 rounded-full border px-3 py-1.5 tabular-nums shadow-sm backdrop-blur-sm'>
                {total > 0
                  ? t('productCount', { count: formatInteger(total) })
                  : t('loadingCatalog')}
              </span>
              {loadedCount > 0 && (
                <span className='bg-background/85 border-border/60 rounded-full border px-3 py-1.5 tabular-nums shadow-sm backdrop-blur-sm'>
                  {t('loadedCount', { count: formatInteger(loadedCount) })}
                </span>
              )}
              {isFetching && (
                <span className='text-accent animate-pulse text-xs font-medium tracking-wide uppercase'>
                  {t('updating')}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
            className='relative'
          >
            <div className='absolute end-3 top-3 z-10 flex gap-2'>
              <Button
                type='button'
                size='icon'
                variant='outline'
                className='bg-background/90 h-9 w-9 rounded-full shadow-sm backdrop-blur-sm'
                aria-label={t('prevPromo')}
                onClick={() =>
                  setSlideIndex((i) => (i - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length)
                }
              >
                <IconChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                type='button'
                size='icon'
                variant='outline'
                className='bg-background/90 h-9 w-9 rounded-full shadow-sm backdrop-blur-sm'
                aria-label={t('nextPromo')}
                onClick={() => setSlideIndex((i) => (i + 1) % PROMO_SLIDES.length)}
              >
                <IconChevronRight className='h-4 w-4' />
              </Button>
            </div>

            <div className='border-border/50 relative overflow-hidden rounded-3xl border bg-white/40 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.35)] backdrop-blur-md'>
              <div className='relative aspect-16/11 w-full'>
                <AppImage
                  src={slide.image}
                  alt=''
                  fill
                  priority
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 48vw'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent' />
              </div>

              <div className='absolute start-4 end-4 bottom-4 sm:inset-y-0 sm:start-auto sm:end-6 sm:flex sm:items-center'>
                <div className='border-border/60 max-w-xs rounded-2xl border bg-white/90 p-5 shadow-lg backdrop-blur-md'>
                  <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                    {t(`promos.${slide.id}.eyebrow`)}
                  </p>
                  <p className='font-display mt-1 text-xl font-semibold tracking-tight'>
                    {t(`promos.${slide.id}.title`)}
                  </p>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {t(`promos.${slide.id}.description`)}
                  </p>
                  <Button asChild className='mt-4 h-10 rounded-full px-5'>
                    <Link href={slide.href}>{t(`promos.${slide.id}.cta`)}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
