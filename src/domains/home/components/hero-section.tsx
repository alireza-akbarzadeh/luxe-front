import Link from 'next/link';
import { Suspense } from 'react';

import { LandingHeroBackground } from '@/components/effects/landing-hero-background';
import { cn } from '@/lib/utils';

import { HeroAccentHighlight } from './ui/hero-accent-highlight';
import {
  HeroIconArrowRight,
  HeroIconShieldCheck,
  HeroIconSparkles,
  HeroIconStar,
  HeroIconTruck
} from './ui/hero-icons';

const STATS = [
  { value: '120+', label: 'Maisons & makers' },
  { value: '25k+', label: 'Members worldwide' },
  { value: '4.9', label: 'Average rating' },
  { value: '32', label: 'Countries shipped' }
] as const;

const primaryCtaClass = cn(
  'group relative inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full px-8 text-base font-medium tracking-wide',
  'bg-primary text-primary-foreground shadow-lg transition-[color,background-color,transform] duration-200',
  'hover:bg-primary/92 active:scale-[0.98]'
);

const secondaryCtaClass = cn(
  'inline-flex h-13 shrink-0 items-center justify-center rounded-full border px-8 text-base font-medium tracking-wide transition-colors',
  'border-gold/40 bg-card/80 text-foreground hover:border-gold hover:text-gold'
);

async function HeroEditorialPanelDeferred() {
  const { HeroEditorialPanel } = await import('./ui/hero-editorial-panel');
  return <HeroEditorialPanel />;
}

export function HeroSection() {
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
        className='bg-gold/15 pointer-events-none absolute -end-24 -top-32 hidden h-72 w-72 rounded-full blur-3xl lg:block'
      />
      <div
        aria-hidden
        className='bg-gold/10 pointer-events-none absolute -start-24 bottom-8 hidden h-64 w-64 rounded-full blur-3xl lg:block'
      />

      <div className='app-container relative flex w-full flex-col justify-center py-12 sm:py-16 lg:min-h-[calc(100svh-2rem)] lg:py-20'>
        <div className='grid items-center gap-12 lg:grid-cols-12 lg:gap-16'>
          <div className='text-center lg:col-span-6 lg:text-start'>
            <div className='border-gold/30 bg-card/90 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm sm:text-sm'>
              <HeroIconSparkles className='text-gold size-4' />
              <span className='text-foreground tracking-wide'>{`Fall ${year} Collection`}</span>
              <span className='text-muted-foreground'>— now live</span>
            </div>

            <h1 className='hero-lcp-title font-display text-4xl leading-[1.03] font-semibold tracking-tight text-balance max-lg:font-sans sm:text-5xl lg:text-6xl xl:text-[3.5rem]'>
              Modern luxury,
              <HeroAccentHighlight className='hero-lcp-accent text-gold-gradient lg:font-display mt-1 block italic'>
                beautifully curated
              </HeroAccentHighlight>
            </h1>

            <p className='text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg lg:mx-0'>
              Luxe brings together the finest fashion houses and independent makers in one
              considered edit. Timeless pieces, exceptional craftsmanship, delivered to your door.
            </p>

            <div className='mt-7 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 lg:items-start'>
              <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <HeroIconStar key={i} className='text-gold size-4' />
                ))}
              </div>
              <p className='text-muted-foreground text-sm'>
                <span className='text-foreground font-semibold'>4.9/5</span> from over 25,000
                members
              </p>
            </div>

            <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start'>
              <Link href='/shop' className={primaryCtaClass}>
                Shop new arrivals
                <HeroIconArrowRight className='cn-rtl-flip ms-2 size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
              </Link>
              <Link href='/collections' className={secondaryCtaClass}>
                Explore collections
              </Link>
            </div>

            <div className='text-muted-foreground mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm lg:justify-start'>
              <span className='inline-flex items-center gap-2'>
                <HeroIconTruck className='text-gold size-4' />
                Complimentary worldwide shipping
              </span>
              <span className='inline-flex items-center gap-2'>
                <HeroIconShieldCheck className='text-gold size-4' />
                Authenticity guaranteed
              </span>
            </div>

            <dl className='border-gold/15 mt-10 hidden grid-cols-2 gap-y-6 border-t pt-8 sm:grid sm:grid-cols-4'>
              {STATS.map((stat) => (
                <div key={stat.label} className='text-center lg:text-start'>
                  <dt className='font-display text-2xl font-semibold sm:text-3xl'>{stat.value}</dt>
                  <dd className='text-muted-foreground mt-1 text-xs tracking-wide sm:text-sm'>
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className='relative hidden lg:col-span-6 lg:block'>
            <Suspense fallback={null}>
              <HeroEditorialPanelDeferred />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
