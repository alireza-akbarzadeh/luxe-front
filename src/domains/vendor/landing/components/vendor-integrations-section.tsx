'use client';

import { useTranslations } from 'next-intl';

import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { INTEGRATIONS } from '@/domains/vendor/landing/data/vendor-landing.data';

export function VendorIntegrationsSection() {
  const t = useTranslations('vendor.landing.integrations');

  return (
    <LandingContainer className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('subtitle')} />
      </FadeInView>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
        {INTEGRATIONS.map((integration, index) => (
          <FadeInView key={integration.name} delay={index * 0.03}>
            <div className='border-border/50 bg-card/40 hover:border-border flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md'>
              <div className='bg-muted/50 flex size-11 items-center justify-center rounded-xl'>
                <integration.icon className='text-muted-foreground size-5' aria-hidden />
              </div>
              <span className='text-center text-xs font-medium'>{integration.name}</span>
            </div>
          </FadeInView>
        ))}
      </div>
    </LandingContainer>
  );
}
