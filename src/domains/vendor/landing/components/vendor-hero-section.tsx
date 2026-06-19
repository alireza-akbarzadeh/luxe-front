'use client';

import {
  IconArrowRight,
  IconChartBar,
  IconPackage,
  IconPlayerPlay,
  IconShoppingCart,
  IconSparkles,
  IconTrendingUp
} from '@tabler/icons-react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { FadeInView } from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { DASHBOARD_METRICS } from '@/domains/vendor/landing/data/vendor-landing.data';
import { cn } from '@/lib/utils';

interface VendorHeroSectionProps {
  isAuthenticated: boolean;
}

export function VendorHeroSection({ isAuthenticated }: VendorHeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const startHref = isAuthenticated ? '/vendor/panel' : '/register?callbackUrl=/vendor/panel';

  return (
    <section className='relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--gold)_0%,transparent_55%)] opacity-[0.12] dark:opacity-[0.18]'
      />
      <div
        aria-hidden
        className='bg-gold/10 pointer-events-none absolute top-20 -right-24 h-80 w-80 rounded-full blur-3xl'
      />
      <div
        aria-hidden
        className='bg-gold/8 pointer-events-none absolute bottom-0 -left-16 h-64 w-64 rounded-full blur-3xl'
      />

      <div className='relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8'>
        <FadeInView>
          <div className='border-border/60 bg-card/50 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur'>
            <IconSparkles className='text-gold size-3.5' aria-hidden />
            Multi-vendor marketplace
          </div>

          <h1 className='mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl'>
            Grow your business with thousands of new customers
          </h1>

          <p className='text-muted-foreground mt-5 max-w-xl text-base leading-relaxed md:text-lg'>
            Join a premium marketplace built for modern brands. Launch your storefront, reach
            high-intent shoppers worldwide, and manage everything from one beautiful vendor
            dashboard.
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <Link
              href={startHref}
              className={cn(buttonVariants({ size: 'lg' }), 'gap-2 rounded-full px-8')}
            >
              Start selling today
              <IconArrowRight className='size-4' aria-hidden />
            </Link>
            <Button variant='outline' size='lg' className='gap-2 rounded-full px-6' asChild>
              <a href='#dashboard'>
                <IconPlayerPlay className='size-4' aria-hidden />
                Watch demo
              </a>
            </Button>
          </div>
        </FadeInView>

        <FadeInView delay={0.15} className='relative'>
          <DashboardMockup reduceMotion={Boolean(reduceMotion)} />
        </FadeInView>
      </div>
    </section>
  );
}

function DashboardMockup({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className='relative mx-auto w-full max-w-lg lg:max-w-none'>
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className='border-border/60 bg-card/80 relative rounded-3xl border p-4 shadow-2xl shadow-black/10 backdrop-blur-xl'
      >
        <div className='border-border/50 mb-4 flex items-center justify-between border-b pb-3'>
          <div className='flex items-center gap-2'>
            <div className='bg-gold/20 size-8 rounded-lg' />
            <div>
              <p className='text-xs font-medium'>Vendor dashboard</p>
              <p className='text-muted-foreground text-[10px]'>Live overview</p>
            </div>
          </div>
          <span className='bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full px-2 py-0.5 text-[10px] font-medium'>
            Online
          </span>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          {DASHBOARD_METRICS.map((metric) => (
            <div
              key={metric.label}
              className='border-border/40 bg-muted/30 rounded-2xl border p-3'
            >
              <p className='text-muted-foreground text-[10px]'>{metric.label}</p>
              <p className='mt-1 text-lg font-semibold tabular-nums'>{metric.value}</p>
              <p
                className={cn(
                  'mt-0.5 text-[10px] font-medium',
                  metric.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                )}
              >
                {metric.change}
              </p>
            </div>
          ))}
        </div>

        <div className='border-border/40 bg-muted/20 mt-3 rounded-2xl border p-3'>
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-xs font-medium'>Revenue trend</p>
            <IconTrendingUp className='text-gold size-4' aria-hidden />
          </div>
          <div className='flex h-20 items-end gap-1.5'>
            {[35, 52, 44, 68, 58, 82, 76, 95, 88, 100].map((h, i) => (
              <div
                key={i}
                className='bg-gold/70 flex-1 rounded-t-sm'
                style={{ height: `${h}%` }}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className='mt-3 grid grid-cols-3 gap-2'>
          {[
            { icon: IconShoppingCart, label: 'Orders' },
            { icon: IconPackage, label: 'Products' },
            { icon: IconChartBar, label: 'Analytics' }
          ].map((item) => (
            <div
              key={item.label}
              className='border-border/40 bg-background/60 flex flex-col items-center gap-1 rounded-xl border py-2'
            >
              <item.icon className='text-muted-foreground size-4' aria-hidden />
              <span className='text-[10px]'>{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className='border-border/50 bg-card/90 absolute -right-2 -bottom-4 max-w-[160px] rounded-2xl border p-3 shadow-lg backdrop-blur md:-right-6'
        aria-hidden
      >
        <p className='text-[10px] font-medium'>New order</p>
        <p className='text-muted-foreground mt-0.5 text-[10px]'>#LX-48291 · $284.00</p>
      </motion.div>
    </div>
  );
}
