import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { GradientCtaLink } from '@/components/buttons/gradient-cta-link';
import { DirectionalArrow } from '@/components/ui/directional-icon';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text, Typography } from '@/components/ui/typography';
import { marketingNumbers } from '@/lib/i18n/marketing-numbers';
import { cn } from '@/lib/utils';

import { HeroAccentHighlight } from './ui/hero-accent-highlight';
import { HeroIconSparkles, HeroIconStar } from './ui/hero-icons';

const secondaryCtaClass = cn(
  'inline-flex h-11 shrink-0 items-center justify-center rounded-full border px-6 text-sm font-medium tracking-wide transition-colors',
  'border-border bg-card text-foreground hover:border-gold hover:text-gold'
);

async function HeroEditorialPanelDeferred() {
  const { HeroEditorialPanel } = await import('./ui/hero-editorial-panel');
  return <HeroEditorialPanel />;
}

/** Compact split hero — storefront home vibe, not full-viewport editorial. */
export async function HeroSection() {
  const t = await getTranslations('home.hero');
  const year = new Date().getFullYear();

  return (
    <section className='hero-mobile-perf bg-background relative overflow-hidden'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_0%,var(--gold)_0%,transparent_55%)] opacity-[0.08] dark:opacity-[0.12]'
      />

      <div className='app-container relative py-8 sm:py-10 lg:py-12'>
        <Grid cols={1} className='items-center gap-8 lg:grid-cols-12 lg:gap-10'>
          <Flex direction='column' align='start' className='lg:col-span-6'>
            <span className='border-border/60 bg-card mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase'>
              <HeroIconSparkles className='text-gold size-3.5' />
              <span className='text-foreground'>{t('seasonBadge', { year })}</span>
              <span className='text-muted-foreground'>— {t('seasonLive')}</span>
            </span>

            <Typography.H1
              family='display'
              className='hero-lcp-title text-3xl leading-[1.08] font-semibold tracking-tight text-balance max-lg:font-sans sm:text-4xl lg:text-[2.75rem]'
            >
              {t('titleLine1')}
              <HeroAccentHighlight className='hero-lcp-accent text-gold-gradient lg:font-display mt-1 block italic'>
                {t('titleLine2')}
              </HeroAccentHighlight>
            </Typography.H1>

            <Typography.Muted className='mt-4 max-w-md text-sm leading-relaxed text-pretty sm:text-base'>
              {t('description')}
            </Typography.Muted>

            <Flex direction='row' align='center' gap={2} className='mt-4'>
              <Flex direction='row' gap={0.5}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <HeroIconStar key={i} className='text-gold size-3.5' />
                ))}
              </Flex>
              <Typography.Muted className='text-xs sm:text-sm'>
                <Text as='span' weight='semibold'>
                  {t('ratingValue', { rating: marketingNumbers.heroRating })}
                </Text>
                {' · '}
                {t('socialProof', { count: marketingNumbers.heroShopperCount })}
              </Typography.Muted>
            </Flex>

            <Flex direction='row' gap={2.5} className='mt-6 w-full flex-col sm:flex-row'>
              <GradientCtaLink
                href='/shop'
                className='inline-flex h-11 items-center gap-2 px-6 text-sm'
              >
                {t('shopNewArrivals')}
                <DirectionalArrow />
              </GradientCtaLink>
              <Link href='/collections' className={secondaryCtaClass}>
                {t('exploreCollections')}
              </Link>
            </Flex>
          </Flex>

          <div className='relative lg:col-span-6'>
            <Suspense
              fallback={
                <div className='bg-muted/40 aspect-[5/4] animate-pulse rounded-2xl lg:aspect-auto lg:min-h-[22rem]' />
              }
            >
              <HeroEditorialPanelDeferred />
            </Suspense>
          </div>
        </Grid>
      </div>
    </section>
  );
}
