'use client';

import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Grid } from '@/components/ui/grid';
import { Text } from '@/components/ui/typography';
import { FadeInView, LandingContainer } from '@/domains/plus/components/plus-landing-primitives';
import type { DtoPlusBenefitsResponse } from '@/services/-plus-benefits-get.schemas';

type PlusStatsSectionProps = {
  benefits: DtoPlusBenefitsResponse;
};

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <Box className='text-center'>
      <Text className='font-display text-3xl font-semibold tracking-tight tabular-nums md:text-4xl'>
        {value}
      </Text>
      <Text variant='muted' className='mt-2 text-sm'>
        {label}
      </Text>
    </Box>
  );
}

export function PlusStatsSection({ benefits }: PlusStatsSectionProps) {
  const t = useTranslations('plus.landing.stats');
  const currency = benefits.currency ?? 'USD';
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(benefits.annual_price ?? 49.99);

  return (
    <LandingContainer className='border-border/40 bg-muted/20 border-y py-12 md:py-16'>
      <FadeInView>
        <Grid cols={2} className='gap-8 md:grid-cols-4 md:gap-6'>
          <StatBlock value={`${benefits.discount_percent ?? 10}%`} label={t('discount')} />
          <StatBlock value={`${benefits.return_window_days?.plus ?? 60}`} label={t('returnDays')} />
          <StatBlock value={price} label={t('annualPrice')} />
          <StatBlock value={t('instantValue')} label={t('instantLabel')} />
        </Grid>
      </FadeInView>
    </LandingContainer>
  );
}
