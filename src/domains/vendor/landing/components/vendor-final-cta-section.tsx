'use client';

import { IconCalendar } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { GradientCtaLink } from '@/components/buttons/gradient-cta-link';
import { LandingCtaShell } from '@/components/effects/landing-cta-shell';
import { Button } from '@/components/ui/button';
import { DirectionalArrow } from '@/components/ui/directional-icon';
import {
  FadeInView,
  LandingContainer
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { getVendorStartHref } from '@/domains/vendor/lib/vendor-routes';

interface VendorFinalCtaSectionProps {
  hasVendorStore: boolean;
}

export function VendorFinalCtaSection({ hasVendorStore }: VendorFinalCtaSectionProps) {
  const t = useTranslations('vendor.landing.finalCta');
  const vendorHref = getVendorStartHref(hasVendorStore);

  return (
    <LandingContainer className='pb-20 md:pb-28'>
      <FadeInView>
        <LandingCtaShell>
          <h2 className='text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-5xl'>
            {t('growTitle')}
          </h2>
          <p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-relaxed md:text-lg'>
            {t('growDescription')}
          </p>
          <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
            <GradientCtaLink href={vendorHref} className='inline-flex items-center gap-2'>
              {t('becomeVendor')}
              <DirectionalArrow />
            </GradientCtaLink>
            <Button variant='outline' size='lg' className='gap-2 rounded-full px-6' asChild>
              <Link href='/contact'>
                <IconCalendar className='size-4' aria-hidden />
                {t('scheduleDemo')}
              </Link>
            </Button>
          </div>
        </LandingCtaShell>
      </FadeInView>
    </LandingContainer>
  );
}
