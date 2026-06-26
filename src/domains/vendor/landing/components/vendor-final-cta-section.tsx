'use client';

import { IconArrowRight, IconCalendar } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  FadeInView,
  LandingContainer
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { cn } from '@/lib/utils';

interface VendorFinalCtaSectionProps {
  isAuthenticated: boolean;
}

export function VendorFinalCtaSection({ isAuthenticated }: VendorFinalCtaSectionProps) {
  const t = useTranslations('vendor.landing.finalCta');
  const vendorHref = isAuthenticated ? '/vendor/panel' : '/register?callbackUrl=/vendor/panel';

  return (
    <LandingContainer className='pb-20 md:pb-28'>
      <FadeInView>
        <div className='border-border/50 from-gold/15 via-gold/5 to-card/40 relative overflow-hidden rounded-[2rem] border bg-gradient-to-br px-6 py-16 text-center md:px-12 md:py-20'>
          <div
            aria-hidden
            className='bg-gold/20 pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl'
          />
          <div className='relative'>
            <h2 className='text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-5xl'>
              {t('growTitle')}
            </h2>
            <p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg'>
              {t('growDescription')}
            </p>
            <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
              <Link
                href={vendorHref}
                className={cn(buttonVariants({ size: 'lg' }), 'gap-2 rounded-full px-8')}
              >
                {t('becomeVendor')}
                <IconArrowRight className='size-4' aria-hidden />
              </Link>
              <Button variant='outline' size='lg' className='gap-2 rounded-full px-6' asChild>
                <Link href='/contact'>
                  <IconCalendar className='size-4' aria-hidden />
                  {t('scheduleDemo')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </FadeInView>
    </LandingContainer>
  );
}
