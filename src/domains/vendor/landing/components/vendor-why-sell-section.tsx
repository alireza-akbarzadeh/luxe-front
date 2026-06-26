'use client';

import { useTranslations } from 'next-intl';

import {
  FadeInView,
  FeatureCard,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { useVendorLandingContent } from '@/domains/vendor/landing/hooks/use-vendor-landing-content';

export function VendorWhySellSection() {
  const t = useTranslations('vendor.landing.whySell');
  const { whySellFeatures } = useVendorLandingContent();

  return (
    <LandingContainer id='features' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('titleWeb')} description={t('subtitle')} />
      </FadeInView>

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {whySellFeatures.map((feature, index) => (
          <FadeInView key={feature.id} delay={index * 0.05}>
            <FeatureCard
              icon={feature.icon ? <feature.icon className='size-5' aria-hidden /> : null}
              title={feature.title}
              description={feature.description}
              bullets={feature.bullets}
            />
          </FadeInView>
        ))}
      </div>
    </LandingContainer>
  );
}
