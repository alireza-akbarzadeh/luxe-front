'use client';

import { useTranslations } from 'next-intl';

import { Grid } from '@/components/ui/grid';
import { PlusBenefitsGrid } from '@/domains/plus/components/plus-benefits-grid';
import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/plus/components/plus-landing-primitives';
import { PlusPricingCard } from '@/domains/plus/components/plus-pricing-card';
import type { DtoPlusBenefitsResponse } from '@/services/-plus-benefits-get.schemas';

type PlusPricingSectionProps = {
  benefits: DtoPlusBenefitsResponse;
};

export function PlusPricingSection({ benefits }: PlusPricingSectionProps) {
  const t = useTranslations('plus.landing.pricingSection');

  return (
    <LandingContainer id='subscribe' className='py-16 md:py-24'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      </FadeInView>

      <Grid cols={1} className='items-start gap-8 lg:grid-cols-5'>
        <FadeInView delay={0.06} className='lg:col-span-2'>
          <PlusPricingCard benefits={benefits} />
        </FadeInView>
        <FadeInView delay={0.12} className='lg:col-span-3'>
          <PlusBenefitsGrid features={benefits.features ?? []} />
        </FadeInView>
      </Grid>
    </LandingContainer>
  );
}
