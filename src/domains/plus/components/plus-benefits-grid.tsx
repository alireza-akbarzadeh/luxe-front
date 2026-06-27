'use client';

import {
  IconHeadset,
  IconPackage,
  IconPercentage,
  IconRotateClockwise,
  IconSparkles
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text, Typography } from '@/components/ui/typography';
import type { DtoPlusBenefitFeature } from '@/services/-plus-benefits-get.schemas';

const ICONS: Record<string, typeof IconSparkles> = {
  discount: IconPercentage,
  shipping: IconPackage,
  returns: IconRotateClockwise,
  support: IconHeadset
};

export function PlusBenefitsGrid({ features }: { features: DtoPlusBenefitFeature[] }) {
  const t = useTranslations('plus.landing');

  return (
    <Box>
      <Typography.H4 className='mb-4 text-xl font-semibold'>{t('benefitsTitle')}</Typography.H4>
      <Grid cols={1} className='gap-4 sm:grid-cols-2'>
        {features.map((feature) => {
          const Icon = ICONS[feature.key ?? ''] ?? IconSparkles;
          return (
            <Box
              key={feature.key ?? feature.title}
              className='border-border/50 bg-card/60 rounded-2xl border p-5 shadow-sm backdrop-blur-sm'
            >
              <Flex align='start' gap={4}>
                <Flex
                  align='center'
                  justify='center'
                  className='from-gold/20 to-gold/5 text-gold-strong size-11 shrink-0 rounded-xl bg-linear-to-br'
                >
                  <Icon className='size-5' aria-hidden />
                </Flex>
                <Box className='min-w-0 space-y-1'>
                  <Typography.H6 className='text-base font-semibold'>{feature.title}</Typography.H6>
                  <Text variant='muted' className='text-sm leading-relaxed'>
                    {feature.description}
                  </Text>
                </Box>
              </Flex>
            </Box>
          );
        })}
        <Box className='border-gold/30 from-gold/10 via-card/80 to-card/60 col-span-full rounded-2xl border bg-linear-to-br p-5 sm:col-span-2'>
          <Text className='text-muted-foreground text-sm leading-relaxed'>{t('finePrint')}</Text>
        </Box>
      </Grid>
    </Box>
  );
}
