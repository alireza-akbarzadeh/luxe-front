import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { GradientCtaLink } from '@/components/buttons/gradient-cta-link';
import { LandingHeroBackground } from '@/components/effects/landing-hero-background';
import { DirectionalArrow } from '@/components/ui/directional-icon';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text, Typography } from '@/components/ui/typography';
import { marketingNumbers } from '@/lib/i18n/marketing-numbers';
import { cn } from '@/lib/utils';

import { HOME_STATS } from '../lib/home-mock-data';
import { HeroAccentHighlight } from './ui/hero-accent-highlight';
import {
  HeroIconShieldCheck,
  HeroIconSparkles,
  HeroIconStar,
  HeroIconTruck
} from './ui/hero-icons';

const secondaryCtaClass = cn(
  'inline-flex h-13 shrink-0 items-center justify-center rounded-full border px-8 text-base font-medium tracking-wide transition-colors',
  'border-gold/40 bg-card/80 text-foreground hover:border-gold hover:text-gold'
);

async function HeroEditorialPanelDeferred() {
  const { HeroEditorialPanel } = await import('./ui/hero-editorial-panel');
  return <HeroEditorialPanel />;
}

export async function HeroSection() {
  const t = await getTranslations('home.hero');
  const year = new Date().getFullYear();

  return (
    <section className='hero-mobile-perf bg-background relative overflow-hidden'>
      <LandingHeroBackground />
      <div
        aria-hidden
        className='from-background via-background to-surface pointer-events-none absolute inset-0 bg-gradient-to-b'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--gold)_0%,transparent_55%)] opacity-[0.1] dark:opacity-[0.16]'
      />
      <div
        aria-hidden
        className='bg-gold/15 pointer-events-none absolute -end-24 -top-32 hidden h-72 w-72 rounded-full blur-3xl lg:block'
      />
      <div
        aria-hidden
        className='bg-gold/10 pointer-events-none absolute -start-24 bottom-8 hidden h-64 w-64 rounded-full blur-3xl lg:block'
      />

      <div className='app-container relative flex w-full flex-col justify-center py-12 sm:py-16 lg:min-h-[calc(100svh-2rem)] lg:py-20'>
        <Grid cols={1} className='items-center gap-12 lg:grid-cols-12 lg:gap-16'>
          <Flex
            direction='column'
            align='center'
            className='text-center lg:col-span-6 lg:items-start lg:text-start'
          >
            <span className='border-border/60 bg-card/50 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase backdrop-blur sm:text-sm'>
              <HeroIconSparkles className='text-gold size-4' />
              <span className='text-foreground'>{t('seasonBadge', { year })}</span>
              <span className='text-muted-foreground'>— {t('seasonLive')}</span>
            </span>

            <Typography.H1
              family='display'
              className='hero-lcp-title text-4xl leading-[1.03] font-semibold tracking-tight text-balance max-lg:font-sans sm:text-5xl lg:text-6xl xl:text-[3.5rem]'
            >
              {t('titleLine1')}
              <HeroAccentHighlight className='hero-lcp-accent text-gold-gradient lg:font-display mt-1 block italic'>
                {t('titleLine2')}
              </HeroAccentHighlight>
            </Typography.H1>

            <Typography.Muted className='mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg lg:mx-0'>
              {t('description')}
            </Typography.Muted>

            <Flex
              direction='row'
              align='center'
              gap={2}
              className='mt-7 flex-col sm:flex-row lg:items-start'
            >
              <Flex direction='row' gap={1}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <HeroIconStar key={i} className='text-gold mt-2 size-4' />
                ))}
              </Flex>
              <Typography.Muted className='text-sm'>
                <Text as='span' weight='semibold'>
                  {t('ratingValue', { rating: marketingNumbers.heroRating })}
                </Text>
                {' · '}
                {t('socialProof', { count: marketingNumbers.heroShopperCount })}
              </Typography.Muted>
            </Flex>

            <Flex
              direction='row'
              gap={3}
              className='mt-8 w-full flex-col justify-center sm:flex-row lg:justify-start'
            >
              <GradientCtaLink href='/shop' className='inline-flex h-13 items-center gap-2 px-8'>
                {t('shopNewArrivals')}
                <DirectionalArrow />
              </GradientCtaLink>
              <Link href='/collections' className={secondaryCtaClass}>
                {t('exploreCollections')}
              </Link>
            </Flex>

            <Flex
              direction='row'
              gap={6}
              wrap='wrap'
              className='text-muted-foreground mt-7 justify-center text-sm lg:justify-start'
            >
              <span className='inline-flex items-center gap-2'>
                <HeroIconTruck className='text-gold size-4' />
                {t('trust.shipping')}
              </span>
              <span className='inline-flex items-center gap-2'>
                <HeroIconShieldCheck className='text-gold size-4' />
                {t('trust.authenticity')}
              </span>
            </Flex>

            <Grid
              cols={2}
              className='border-border/40 mt-10 hidden gap-y-6 border-t pt-8 sm:grid sm:grid-cols-4'
            >
              {HOME_STATS.map((stat) => (
                <Flex key={stat.key} direction='column' className='text-center lg:text-start'>
                  <Typography.Large family='display' className='text-2xl font-semibold sm:text-3xl'>
                    {stat.value >= 1000
                      ? `${Math.round(stat.value / 1000)}k${stat.suffix}`
                      : `${stat.value}${stat.suffix}`}
                  </Typography.Large>
                  <Typography.Subtle className='mt-1'>{t(`stats.${stat.key}`)}</Typography.Subtle>
                </Flex>
              ))}
            </Grid>
          </Flex>

          <div className='relative hidden lg:col-span-6 lg:block'>
            <Suspense fallback={null}>
              <HeroEditorialPanelDeferred />
            </Suspense>
          </div>
        </Grid>
      </div>
    </section>
  );
}
