'use client';

import { useTranslations } from 'next-intl';

import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { VendorPricingTabs } from '@/domains/vendor/landing/components/vendor-pricing-compare-sheet';

interface VendorPricingSectionProps {
  hasVendorStore: boolean;
}

export function VendorPricingSection({ hasVendorStore }: VendorPricingSectionProps) {
  const t = useTranslations('vendor.landing.pricing');

  return (
    <LandingContainer id='pricing' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('subtitle')} />
      </FadeInView>

      <FadeInView delay={0.08}>
        <VendorPricingTabs hasVendorStore={hasVendorStore} />
      </FadeInView>
    </LandingContainer>
  );
}
