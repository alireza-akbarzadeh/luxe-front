'use client';

import { useTranslations } from 'next-intl';

import {
  FadeInView,
  LandingContainer,
  PricingCard,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { useVendorLandingContent } from '@/domains/vendor/landing/hooks/use-vendor-landing-content';
import { getVendorStartHref } from '@/domains/vendor/lib/vendor-routes';

interface VendorPricingSectionProps {
  hasVendorStore: boolean;
}

export function VendorPricingSection({ hasVendorStore }: VendorPricingSectionProps) {
  const t = useTranslations('vendor.landing.pricing');
  const { pricingPlans } = useVendorLandingContent();
  const startHref = getVendorStartHref(hasVendorStore);

  return (
    <LandingContainer id='pricing' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('subtitle')} />
      </FadeInView>

      <div className='grid gap-6 lg:grid-cols-3 lg:gap-8'>
        {pricingPlans.map((plan, index) => (
          <FadeInView key={plan.id} delay={index * 0.08}>
            <PricingCard {...plan} href={plan.id === 'enterprise' ? '/contact' : startHref} />
          </FadeInView>
        ))}
      </div>
    </LandingContainer>
  );
}
