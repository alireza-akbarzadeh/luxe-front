'use client';

import { useTranslations } from 'next-intl';

import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/plus/components/plus-landing-primitives';
import { PlusPlanCompareTable } from '@/domains/plus/components/plus-plan-compare-table';
import type { DtoPlusBenefitsResponse } from '@/services/-plus-benefits-get.schemas';

type PlusComparisonSectionProps = {
  benefits: DtoPlusBenefitsResponse;
};

export function PlusComparisonSection({ benefits }: PlusComparisonSectionProps) {
  const t = useTranslations('plus.landing.compare');

  return (
    <LandingContainer id='compare' className='py-16 md:py-24'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      </FadeInView>

      <FadeInView delay={0.08}>
        <PlusPlanCompareTable benefits={benefits} className='mx-auto max-w-3xl shadow-lg' />
      </FadeInView>
    </LandingContainer>
  );
}
