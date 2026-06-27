'use client';

import {
  IconArrowDown,
  IconPercentage,
  IconRotateClockwise,
  IconSparkles,
  IconTruck
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Button, buttonVariants } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text, Typography } from '@/components/ui/typography';
import { FadeInView, LandingContainer } from '@/domains/plus/components/plus-landing-primitives';
import { PlusMembershipBadge } from '@/domains/plus/components/plus-membership-badge';
import { cn } from '@/lib/utils';
import type { DtoPlusBenefitsResponse } from '@/services/-plus-benefits-get.schemas';

type PlusHeroSectionProps = {
  benefits: DtoPlusBenefitsResponse;
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

function PerkPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Flex
      align='center'
      gap={2}
      className='border-border/60 bg-card/70 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm'
    >
      <Box className='text-gold-strong' aria-hidden>
        {icon}
      </Box>
      <Text className='text-xs'>{label}</Text>
    </Flex>
  );
}

function CheckoutPreviewCard({ benefits }: { benefits: DtoPlusBenefitsResponse }) {
  const t = useTranslations('plus.landing.hero');
  const discount = benefits.discount_percent ?? 10;
  const subtotal = 420;
  const savings = Math.round(subtotal * (discount / 100));

  return (
    <Box className='border-gold/25 from-gold/12 via-card to-card relative overflow-hidden rounded-3xl border bg-linear-to-br p-6 shadow-2xl shadow-black/10'>
      <Box
        aria-hidden
        className='bg-gold/25 pointer-events-none absolute -top-16 -right-10 size-40 rounded-full blur-3xl'
      />
      <Flex align='center' justify='between' gap={3} className='relative mb-5'>
        <Box>
          <Text className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
            {t('previewLabel')}
          </Text>
          <Typography.H4 className='mt-1 text-lg font-semibold'>{t('previewTitle')}</Typography.H4>
        </Box>
        <PlusMembershipBadge size='sm' />
      </Flex>

      <Box className='relative space-y-3 rounded-2xl border border-white/10 bg-black/5 p-4 dark:bg-white/5'>
        <Flex justify='between' className='text-sm'>
          <Text variant='muted'>{t('previewSubtotal')}</Text>
          <Text className='tabular-nums'>
            {formatCurrency(subtotal, benefits.currency ?? 'USD')}
          </Text>
        </Flex>
        <Flex justify='between' className='text-sm'>
          <Text className='text-emerald-700 dark:text-emerald-400'>
            {t('previewDiscount', { percent: discount })}
          </Text>
          <Text className='text-emerald-700 tabular-nums dark:text-emerald-400'>
            −{formatCurrency(savings, benefits.currency ?? 'USD')}
          </Text>
        </Flex>
        <Box className='border-border/50 my-2 border-t' />
        <Flex justify='between'>
          <Text className='font-medium'>{t('previewTotal')}</Text>
          <Text className='text-lg font-semibold tabular-nums'>
            {formatCurrency(subtotal - savings, benefits.currency ?? 'USD')}
          </Text>
        </Flex>
      </Box>

      <Text variant='muted' className='relative mt-4 text-center text-xs'>
        {t('previewNote')}
      </Text>
    </Box>
  );
}

export function PlusHeroSection({ benefits }: PlusHeroSectionProps) {
  const t = useTranslations('plus.landing.hero');
  const discount = benefits.discount_percent ?? 10;
  const plusReturns = benefits.return_window_days?.plus ?? 60;
  const freeReturns = benefits.return_window_days?.free ?? 30;

  return (
    <LandingContainer className='relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-20'>
      <Box
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.055]'
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black, transparent)'
        }}
      />
      <Box
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,var(--gold)_0%,transparent_55%)] opacity-[0.14] dark:opacity-[0.2]'
      />

      <Grid cols={1} className='relative items-center gap-12 lg:grid-cols-2 lg:gap-16'>
        <FadeInView>
          <Flex align='center' gap={2} className='text-gold-strong mb-5'>
            <IconSparkles className='size-5' aria-hidden />
            <Text className='text-sm font-medium tracking-[0.14em] uppercase'>{t('eyebrow')}</Text>
          </Flex>

          <Typography.H1
            family='display'
            className='text-4xl leading-[1.08] sm:text-5xl lg:text-[3.25rem]'
          >
            {t('title')}
          </Typography.H1>

          <Text variant='muted' className='mt-5 max-w-xl text-lg leading-relaxed'>
            {t('description')}
          </Text>

          <Flex wrap='wrap' gap={2} className='mt-6'>
            <PerkPill
              icon={<IconPercentage className='size-3.5' />}
              label={t('pillDiscount', { percent: discount })}
            />
            <PerkPill
              icon={<IconRotateClockwise className='size-3.5' />}
              label={t('pillReturns', { days: plusReturns })}
            />
            <PerkPill icon={<IconTruck className='size-3.5' />} label={t('pillShipping')} />
          </Flex>

          <Flex wrap='wrap' align='center' gap={3} className='mt-8'>
            <Link
              href='#subscribe'
              className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-8')}
            >
              {t('ctaPrimary')}
            </Link>
            <Button variant='outline' size='lg' className='gap-2 rounded-full px-6' asChild>
              <a href='#compare'>
                {t('ctaSecondary')}
                <IconArrowDown className='size-4' aria-hidden />
              </a>
            </Button>
          </Flex>

          <Text variant='muted' className='mt-4 text-sm'>
            {t('priceHint', {
              price: formatCurrency(benefits.annual_price ?? 49.99, benefits.currency ?? 'USD'),
              freeDays: freeReturns,
              plusDays: plusReturns
            })}
          </Text>
        </FadeInView>

        <FadeInView delay={0.12}>
          <CheckoutPreviewCard benefits={benefits} />
        </FadeInView>
      </Grid>
    </LandingContainer>
  );
}
