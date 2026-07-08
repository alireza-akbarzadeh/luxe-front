'use client';

import { IconPlayerPlay, IconSparkles } from '@tabler/icons-react';
import { useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { GradientCtaLink } from '@/components/buttons/gradient-cta-link';
import { LandingHeroBackground } from '@/components/effects/landing-hero-background';
import { Button } from '@/components/ui/button';
import { DirectionalArrow } from '@/components/ui/directional-icon';
import { FadeInView } from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { getVendorStartHref } from '@/domains/vendor/lib/vendor-routes';
import { DashboardMockup } from '~/src/domains/vendor/landing/components/ui/dashboard-mockup';
interface VendorHeroSectionProps {
  hasVendorStore: boolean;
}

export function VendorHeroSection({ hasVendorStore }: VendorHeroSectionProps) {
  const t = useTranslations('vendor.landing.hero');
  const reduceMotion = useReducedMotion();
  const startHref = getVendorStartHref(hasVendorStore);

  return (
    <section className='relative overflow-hidden pt-24 md:pt-32'>
      <LandingHeroBackground />
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

      <div className='app-container relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16'>
        <FadeInView>
          <div className='border-border/60 bg-card/50 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur'>
            <IconSparkles className='text-gold size-3.5' aria-hidden />
            {t('eyebrow')}
          </div>

          <h1 className='mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl'>
            {t('title')}
          </h1>

          <p className='text-muted-foreground mt-5 max-w-xl text-base leading-relaxed md:text-lg'>
            {t('description')}
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <GradientCtaLink href={startHref} className='inline-flex items-center gap-2'>
              {t('startSelling')}
              <DirectionalArrow />
            </GradientCtaLink>
            <Button variant='outline' size='lg' className='gap-2 rounded-full px-6' asChild>
              <a href='#dashboard'>
                <IconPlayerPlay className='size-4' aria-hidden />
                {t('watchDemo')}
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
