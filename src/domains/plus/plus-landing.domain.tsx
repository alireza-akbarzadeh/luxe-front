'use client';

import { IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { Text, Typography } from '@/components/ui/typography';
import { PlusBenefitsGrid } from '@/domains/plus/components/plus-benefits-grid';
import { PlusPricingCard } from '@/domains/plus/components/plus-pricing-card';
import { usePlusBenefitsQuery } from '@/domains/plus/hooks/use-plus-membership';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const }
  })
};

export function PlusLandingDomain() {
  const t = useTranslations('plus.landing');
  const { data, isLoading, isError } = usePlusBenefitsQuery();
  const benefits = data?.data;

  return (
    <Box className='bg-background relative min-h-svh overflow-hidden'>
      <Box
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]'
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)'
        }}
      />

      <Box className='relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20'>
        <motion.div custom={0} initial='hidden' animate='show' variants={fadeUp}>
          <Flex align='center' gap={2} className='text-gold-strong mb-4'>
            <IconSparkles className='size-5' aria-hidden />
            <Text className='text-sm font-medium tracking-wide uppercase'>{t('eyebrow')}</Text>
          </Flex>
          <Typography.H1 family='display' className='max-w-3xl text-4xl sm:text-5xl'>
            {t('title')}
          </Typography.H1>
          <Text variant='muted' className='mt-4 max-w-2xl text-lg leading-relaxed'>
            {t('description')}
          </Text>
        </motion.div>

        {isLoading ? (
          <Grid cols={1} className='mt-12 gap-6 lg:grid-cols-5'>
            <Skeleton className='h-96 rounded-3xl lg:col-span-2' />
            <Skeleton className='h-96 rounded-3xl lg:col-span-3' />
          </Grid>
        ) : isError || !benefits ? (
          <Text className='text-destructive mt-12'>{t('loadError')}</Text>
        ) : (
          <Grid cols={1} className='mt-12 items-start gap-8 lg:grid-cols-5'>
            <motion.div
              className='lg:col-span-2'
              custom={0.1}
              initial='hidden'
              animate='show'
              variants={fadeUp}
            >
              <PlusPricingCard benefits={benefits} />
            </motion.div>
            <motion.div
              className='lg:col-span-3'
              custom={0.18}
              initial='hidden'
              animate='show'
              variants={fadeUp}
            >
              <Typography.H4 className='mb-4 text-xl font-semibold'>
                {t('benefitsTitle')}
              </Typography.H4>
              <PlusBenefitsGrid features={benefits.features ?? []} />
            </motion.div>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
