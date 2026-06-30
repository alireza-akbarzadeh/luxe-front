import {
  IconArrowRight,
  IconShieldCheck,
  IconSparkles,
  IconStar,
  IconTruck
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeroSpotlight } from '~/src/domains/home/components/ui/hero-spotlight';

const STATS = [
  { value: '120+', label: 'Maisons & makers' },
  { value: '25k+', label: 'Members worldwide' },
  { value: '4.9', label: 'Average rating' },
  { value: '32', label: 'Countries shipped' }
] as const;

const SPOTLIGHT = [
  { name: 'Verdant Leather Tote', price: '$1,290', image: '/hero/leather-bag.png' },
  { name: 'Aurelia Gold Edit', price: '$640', image: '/hero/gold-jewelry.png' }
] as const;

export function HeroSection() {
  const year = new Date().getFullYear();

  return (
    <section className='bg-background relative overflow-hidden'>
      <div
        aria-hidden
        className='from-background via-background to-surface pointer-events-none absolute inset-0 bg-gradient-to-b'
      />
      <div
        aria-hidden
        className='bg-gold/10 pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full blur-3xl'
      />
      <div
        aria-hidden
        className='bg-gold/10 pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl'
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.05]'
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 28%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 28%, black, transparent)'
        }}
      />

      <div className='relative mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:py-20'>
        <div className='grid items-center gap-12 lg:grid-cols-12 lg:gap-16'>
          {/* Copy column */}
          <div className='text-center lg:col-span-6 lg:text-left'>
            <div className='luxe-rise border-gold/30 bg-card/70 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm sm:text-sm'>
              <IconSparkles className='text-gold size-4' aria-hidden />
              <span className='text-foreground tracking-wide'>{`Fall ${year} Collection`}</span>
              <span className='text-muted-foreground'>— now live</span>
            </div>

            {/* LCP element: rendered immediately, no opacity gating */}
            <h1 className='font-display text-4xl leading-[1.03] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-[3.5rem]'>
              Modern luxury,
              <span className='text-gold-gradient mt-1 block italic'>beautifully curated</span>
            </h1>

            <p className='luxe-fade luxe-delay-2 text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg lg:mx-0'>
              Luxe brings together the finest fashion houses and independent makers in one
              considered edit. Timeless pieces, exceptional craftsmanship, delivered to your door.
            </p>

            {/* Social proof */}
            <div className='luxe-fade luxe-delay-3 mt-7 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 lg:items-start'>
              <div className='flex items-center gap-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} className='fill-gold text-gold size-4' aria-hidden />
                ))}
              </div>
              <p className='text-muted-foreground text-sm'>
                <span className='text-foreground font-semibold'>4.9/5</span> from over 25,000
                members
              </p>
            </div>

            {/* CTAs */}
            <div className='luxe-fade luxe-delay-4 mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start'>
              <Link
                href='/shop'
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'group h-13 rounded-full px-8 text-base shadow-lg'
                )}
              >
                Shop new arrivals
                <IconArrowRight className='ml-2 size-4 transition-transform group-hover:translate-x-0.5' />
              </Link>
              <Link
                href='/collections'
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-gold/40 bg-card/50 hover:border-gold hover:text-gold h-13 rounded-full px-8 text-base backdrop-blur-sm transition-colors'
                )}
              >
                Explore collections
              </Link>
            </div>

            {/* Trust badges */}
            <div className='luxe-fade luxe-delay-5 text-muted-foreground mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm lg:justify-start'>
              <span className='inline-flex items-center gap-2'>
                <IconTruck className='text-gold size-4' aria-hidden />
                Complimentary worldwide shipping
              </span>
              <span className='inline-flex items-center gap-2'>
                <IconShieldCheck className='text-gold size-4' aria-hidden />
                Authenticity guaranteed
              </span>
            </div>

            {/* Stats */}
            <dl className='luxe-fade luxe-delay-5 border-gold/15 mt-10 grid grid-cols-2 gap-y-6 border-t pt-8 sm:grid-cols-4'>
              {STATS.map((stat) => (
                <div key={stat.label} className='text-center lg:text-left'>
                  <dt className='font-display text-2xl font-semibold sm:text-3xl'>{stat.value}</dt>
                  <dd className='text-muted-foreground mt-1 text-xs tracking-wide sm:text-sm'>
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual column */}
          <div className='luxe-fade luxe-delay-1 relative lg:col-span-6'>
            <HeroSpotlight />
            {/* Floating badge */}
            <div className='absolute -top-3 -left-3 sm:-top-5 sm:-left-5'>
              <div className='bg-gold text-gold-foreground flex size-20 flex-col items-center justify-center rounded-full text-center shadow-xl sm:size-24'>
                <span className='font-display text-base leading-none font-bold sm:text-lg'>
                  New
                </span>
                <span className='mt-0.5 text-[0.6rem] font-semibold tracking-[0.2em] uppercase'>
                  Season
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
