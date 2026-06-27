'use client';

import { IconCheck, IconMinus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/plus/components/plus-landing-primitives';
import { cn } from '@/lib/utils';
import type { DtoPlusBenefitsResponse } from '@/services/-plus-benefits-get.schemas';

type PlusComparisonSectionProps = {
  benefits: DtoPlusBenefitsResponse;
};

type RowValue = boolean | string;

function CellValue({ value }: { value: RowValue }) {
  if (value === true) {
    return (
      <IconCheck
        className='mx-auto size-5 text-emerald-600 dark:text-emerald-400'
        aria-label='Included'
      />
    );
  }
  if (value === false) {
    return (
      <IconMinus className='text-muted-foreground/50 mx-auto size-5' aria-label='Not included' />
    );
  }
  return <Text className='text-center text-sm font-medium'>{value}</Text>;
}

export function PlusComparisonSection({ benefits }: PlusComparisonSectionProps) {
  const t = useTranslations('plus.landing.compare');
  const discount = benefits.discount_percent ?? 10;
  const freeDays = benefits.return_window_days?.free ?? 30;
  const plusDays = benefits.return_window_days?.plus ?? 60;

  const rows: { label: string; free: RowValue; plus: RowValue }[] = [
    { label: t('rowDiscount'), free: false, plus: t('discountValue', { percent: discount }) },
    {
      label: t('rowReturns'),
      free: t('daysValue', { days: freeDays }),
      plus: t('daysValue', { days: plusDays })
    },
    { label: t('rowShipping'), free: false, plus: true },
    { label: t('rowSupport'), free: t('standardSupport'), plus: t('prioritySupport') },
    { label: t('rowActivation'), free: t('alwaysFree'), plus: t('instantActivation') }
  ];

  return (
    <LandingContainer id='compare' className='py-16 md:py-24'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      </FadeInView>

      <FadeInView delay={0.08}>
        <Box className='border-border/60 bg-card/50 mx-auto max-w-3xl overflow-hidden rounded-3xl border shadow-lg'>
          <Box className='border-border/50 bg-muted/30 grid grid-cols-3 border-b text-sm font-medium'>
            <Box className='p-4' />
            <Flex align='center' justify='center' className='border-border/50 border-x p-4'>
              <Text>{t('freePlan')}</Text>
            </Flex>
            <Flex
              align='center'
              justify='center'
              className='from-gold/15 to-gold/5 bg-linear-to-b p-4'
            >
              <Text className='text-gold-strong font-semibold'>{t('plusPlan')}</Text>
            </Flex>
          </Box>

          {rows.map((row, index) => (
            <Box
              key={row.label}
              className={cn(
                'grid grid-cols-3 text-sm',
                index < rows.length - 1 && 'border-border/40 border-b'
              )}
            >
              <Flex align='center' className='text-muted-foreground p-4 pr-2'>
                {row.label}
              </Flex>
              <Flex align='center' justify='center' className='border-border/40 border-x p-4'>
                <CellValue value={row.free} />
              </Flex>
              <Flex align='center' justify='center' className='bg-gold/5 p-4'>
                <CellValue value={row.plus} />
              </Flex>
            </Box>
          ))}
        </Box>
      </FadeInView>
    </LandingContainer>
  );
}
