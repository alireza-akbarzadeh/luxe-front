'use client';

import { useTranslations } from 'next-intl';

import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { useVendorLandingContent } from '@/domains/vendor/landing/hooks/use-vendor-landing-content';

export function VendorHowItWorksSection() {
  const t = useTranslations('vendor.landing.howItWorks');
  const { howItWorksSteps } = useVendorLandingContent();

  return (
    <LandingContainer className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('subtitle')} />
      </FadeInView>

      <ol className='relative grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
        <div
          aria-hidden
          className='bg-border/60 absolute top-12 right-[12.5%] left-[12.5%] hidden h-px lg:block'
        />
        {howItWorksSteps.map((step, index) => (
          <FadeInView key={step.id} delay={index * 0.08}>
            <li className='border-border/50 bg-card/40 relative flex h-full flex-col rounded-3xl border p-6 backdrop-blur'>
              <span className='text-gold text-xs font-bold tracking-[0.2em]'>{step.step}</span>
              <div className='bg-gold/10 mt-4 flex size-12 items-center justify-center rounded-2xl text-lg font-semibold'>
                {index + 1}
              </div>
              <h3 className='mt-4 text-lg font-semibold tracking-tight'>{step.title}</h3>
              <p className='text-muted-foreground mt-2 flex-1 text-sm leading-relaxed'>
                {step.description}
              </p>
              {index < howItWorksSteps.length - 1 ? (
                <span
                  className='text-muted-foreground mt-4 hidden text-center text-lg lg:block'
                  aria-hidden
                >
                  ↓
                </span>
              ) : null}
            </li>
          </FadeInView>
        ))}
      </ol>
    </LandingContainer>
  );
}
