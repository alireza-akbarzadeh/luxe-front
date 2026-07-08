'use client';

import { useTranslations } from 'next-intl';

import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { VendorBrandsMarquee } from '@/domains/vendor/landing/components/vendor-brands-marquee';
import { useVendorLandingContent } from '@/domains/vendor/landing/hooks/use-vendor-landing-content';

export function VendorLogoCloudSection() {
  const t = useTranslations('vendor.landing.logoCloud');
  const { trustStats } = useVendorLandingContent();

  return (
    <LandingContainer className='border-border/40 border-y py-16 md:py-20'>
      <FadeInView>
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
          align='center'
          className='mb-10'
        />
      </FadeInView>

      <FadeInView delay={0.1}>
        <VendorBrandsMarquee />
      </FadeInView>

      <FadeInView delay={0.15}>
        <dl className='mt-14 grid gap-8 sm:grid-cols-3'>
          {trustStats.map((stat) => (
            <div key={stat.id} className='text-center'>
              <dt className='text-2xl font-semibold tracking-tight md:text-3xl'>{stat.value}</dt>
              <dd className='text-muted-foreground mt-1 text-sm'>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </FadeInView>
    </LandingContainer>
  );
}
