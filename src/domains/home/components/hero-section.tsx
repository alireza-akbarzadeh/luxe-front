import { IconArrowRight, IconSparkles, IconStar } from '@tabler/icons-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeroSpotlight } from '~/src/domains/home/components/ui/hero-spotlight';
import { CarouselSkeleton } from '~/src/domains/home/components/ui/home-skeleton';

import { HERO_TRUST_AVATARS } from '../lib/home-mock-data';
import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';

export async function HeroSection() {
  const t = await getTranslations('home');

  return (
    <section className={`${fullBleedClass} relative overflow-hidden`}>
      <div className='from-background via-background to-surface absolute inset-0 bg-linear-to-b' />
      <div className='bg-gold/10 dark:bg-gold/15 pointer-events-none absolute -top-32 right-0 h-112 w-md rounded-full blur-3xl' />
      <div className='bg-gold/8 pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl' />
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
          <div className='hero-fade-in text-center lg:col-span-6 lg:text-start'>
            <div className='border-gold/30 bg-card/80 text-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm sm:text-sm'>
              <IconSparkles className='text-gold h-4 w-4' />
              <span className='text-gold-strong dark:text-gold tracking-wide'>
                {t('hero.seasonBadge', { year: new Date().getFullYear() })}
              </span>
              <span className='text-muted-foreground'>— {t('hero.seasonLive')}</span>
            </div>

            {/* LCP element — plain HTML, no JS gating it */}
            <h1 className='font-display text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl xl:text-[5.25rem]'>
              {t('hero.titleLine1')}
              <span className='text-gold-gradient mt-1 block italic'>{t('hero.titleLine2')}</span>
            </h1>

            <p className='text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0'>
              {t('hero.description')}
            </p>

            <div className='mt-6 flex flex-col items-center gap-3 sm:flex-row lg:items-start'>
              <div className='flex -space-x-2 rtl:space-x-reverse'>
                {HERO_TRUST_AVATARS.map((src, i) => (
                  <div
                    key={src}
                    className='border-background relative size-9 overflow-hidden rounded-full border-2 sm:size-10'
                    style={{ zIndex: HERO_TRUST_AVATARS.length - i }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt='' className='size-full object-cover' />
                  </div>
                ))}
              </div>
              <div className='text-center sm:text-start'>
                <div className='flex items-center justify-center gap-1 sm:justify-start'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar
                      key={i}
                      className='fill-gold text-gold size-3.5 sm:size-4'
                      aria-hidden
                    />
                  ))}
                  <span className='ms-1 text-sm font-semibold'>
                    {t('hero.ratingValue', { rating: 4.8 })}
                  </span>
                </div>
                <p className='text-muted-foreground text-xs sm:text-sm'>
                  {t('hero.socialProof', { count: 1000 })}
                </p>
              </div>
            </div>

            <div className='mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row lg:justify-start'>
              <Link
                href='/shop'
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'group h-12 rounded-full px-8 text-base shadow-lg sm:h-14'
                )}
              >
                {t('hero.shopNewArrivals')}
                <IconArrowRight className='cn-rtl-flip ms-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='border-gold/40 hover:border-gold hover:text-gold-strong dark:hover:text-gold bg-card/50 h-12 rounded-full px-8 text-base backdrop-blur-sm transition-colors sm:h-14'
                asChild
              >
                <Link href='/collection'>{t('hero.exploreCollections')}</Link>
              </Button>
            </div>

            <div className='border-gold/15 mt-12 grid grid-cols-2 gap-y-6 border-t pt-8 sm:grid-cols-4 lg:gap-6'>
              {HERO_STATS.map((stat) => (
                <dl key={stat.label} className='text-start'>
                  <dt className='font-display text-2xl font-semibold sm:text-3xl'>{stat.value}</dt>
                  <dd className='text-muted-foreground mt-1 text-xs tracking-wide sm:text-sm'>
                    {stat.label}
                  </dd>
                </dl>
              ))}
            </div>
            <p className='text-muted-foreground/80 mt-3 text-[11px] tracking-wide'>
              {t('hero.statsFootnote')}
            </p>
          </div>

          {/* Only this part needs data + JS */}
          <Suspense fallback={<CarouselSkeleton count={8} />}>
            <HeroSpotlight />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

const HERO_STATS = [
  { label: 'Verified brands', value: '120+' },
  { label: 'Independent makers', value: '850+' },
  { label: 'Avg. store rating', value: '4.8' },
  { label: 'Countries represented', value: '32' }
] as const;
