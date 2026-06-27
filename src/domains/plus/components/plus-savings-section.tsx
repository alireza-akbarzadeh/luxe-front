'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Slider } from '@/components/ui/slider';
import { Text, Typography } from '@/components/ui/typography';
import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/plus/components/plus-landing-primitives';
import type { DtoPlusBenefitsResponse } from '@/services/-plus-benefits-get.schemas';

type PlusSavingsSectionProps = {
  benefits: DtoPlusBenefitsResponse;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    amount
  );
}

export function PlusSavingsSection({ benefits }: PlusSavingsSectionProps) {
  const t = useTranslations('plus.landing.savings');
  const currency = benefits.currency ?? 'USD';
  const discountPct = benefits.discount_percent ?? 10;
  const annualPrice = benefits.annual_price ?? 49.99;

  const [annualSpend, setAnnualSpend] = useState(1200);

  const { annualSavings, netBenefit, ordersToBreakEven } = useMemo(() => {
    const savings = annualSpend * (discountPct / 100);
    const net = savings - annualPrice;
    const avgOrder = 150;
    const savingsPerOrder = avgOrder * (discountPct / 100);
    const breakEvenOrders =
      savingsPerOrder > 0 ? Math.ceil(annualPrice / savingsPerOrder) : 0;

    return {
      annualSavings: savings,
      netBenefit: net,
      ordersToBreakEven: breakEvenOrders
    };
  }, [annualPrice, annualSpend, discountPct]);

  return (
    <LandingContainer className='py-16 md:py-24'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      </FadeInView>

      <FadeInView delay={0.1}>
        <Box className='border-gold/25 from-gold/8 via-card to-card mx-auto max-w-2xl rounded-3xl border bg-linear-to-br p-6 shadow-xl sm:p-8'>
          <Text className='text-sm font-medium'>{t('sliderLabel')}</Text>
          <Typography.H3 className='mt-2 text-3xl font-bold tabular-nums'>
            {formatMoney(annualSpend, currency)}
          </Typography.H3>
          <Text variant='muted' className='mt-1 text-sm'>
            {t('sliderHint')}
          </Text>

          <Box className='mt-6 px-1'>
            <Slider
              value={[annualSpend]}
              onValueChange={([value]) => setAnnualSpend(value ?? annualSpend)}
              min={200}
              max={5000}
              step={50}
              aria-label={t('sliderLabel')}
            />
            <Flex justify='between' className='text-muted-foreground mt-2 text-xs'>
              <Text>{formatMoney(200, currency)}</Text>
              <Text>{formatMoney(5000, currency)}</Text>
            </Flex>
          </Box>

          <Grid cols={1} className='mt-8 gap-4 sm:grid-cols-3'>
            <ResultCard
              label={t('annualSavings')}
              value={formatMoney(annualSavings, currency)}
              highlight
            />
            <ResultCard label={t('membershipCost')} value={formatMoney(annualPrice, currency)} />
            <ResultCard
              label={t('netBenefit')}
              value={formatMoney(netBenefit, currency)}
              positive={netBenefit >= 0}
            />
          </Grid>

          <Text variant='muted' className='mt-6 text-center text-sm leading-relaxed'>
            {netBenefit >= 0
              ? t('breakEvenPositive', {
                  orders: ordersToBreakEven,
                  percent: discountPct
                })
              : t('breakEvenNegative', { orders: ordersToBreakEven, percent: discountPct })}
          </Text>
        </Box>
      </FadeInView>
    </LandingContainer>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
  positive
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
}) {
  return (
    <Box
      className={`rounded-2xl border p-4 text-center ${
        highlight
          ? 'border-gold/30 bg-gold/10'
          : positive === true
            ? 'border-emerald-500/30 bg-emerald-500/10'
            : positive === false
              ? 'border-border/50 bg-muted/30'
              : 'border-border/50 bg-muted/20'
      }`}
    >
      <Text variant='muted' className='text-xs font-medium tracking-wide uppercase'>
        {label}
      </Text>
      <Text className='mt-2 text-xl font-semibold tabular-nums'>{value}</Text>
    </Box>
  );
}
