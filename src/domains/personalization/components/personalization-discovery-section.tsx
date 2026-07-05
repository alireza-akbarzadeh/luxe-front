'use client';

import {
  IconApps,
  IconBrain,
  IconMoodSmile,
  IconSparkles,
  IconTargetArrow
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { PlatformCard } from '@/domains/apps/components/platform-card';
import { sectionContainerClass } from '@/domains/home/lib/home-utils';
import {
  PERSONALIZATION_FEATURE_KEYS,
  PERSONALIZATION_ROUTES
} from '@/domains/personalization/lib/personalization-routes';

const FEATURE_ICONS = {
  memory: <IconBrain className='size-5' />,
  goal: <IconTargetArrow className='size-5' />,
  mood: <IconMoodSmile className='size-5' />
};

/** Homepage band — introduces mood, goal, and memory shopping before shoppers reach /apps. */
export function PersonalizationDiscoverySection() {
  const t = useTranslations('personalizationDiscovery');
  const { isAuthenticated } = useAuth();

  return (
    <section id='personalized-shopping' className='py-12 sm:py-16 lg:py-20'>
      <div className={sectionContainerClass}>
        <Flex
          direction='column'
          spacing={3}
          className='border-gold/25 from-gold/8 via-card to-card relative mb-8 overflow-hidden rounded-3xl border bg-linear-to-br p-6 sm:p-8'
        >
          <div
            aria-hidden
            className='bg-accent/15 pointer-events-none absolute end-0 -top-20 h-48 w-48 rounded-full blur-3xl'
          />
          <Flex align='center' spacing={2} className='relative'>
            <IconSparkles className='text-gold-strong size-5 shrink-0' aria-hidden />
            <Typography.Overline className='text-accent'>{t('eyebrow')}</Typography.Overline>
          </Flex>
          <Typography.H2 family='display' className='relative text-2xl font-semibold sm:text-3xl'>
            {t('title')}
          </Typography.H2>
          <Typography.Muted className='relative max-w-2xl text-sm leading-relaxed sm:text-base'>
            {t('description')}
          </Typography.Muted>
          <Flex className='relative flex-wrap gap-2 pt-1'>
            <Button asChild variant='outline' size='sm' className='rounded-full'>
              <Link href={PERSONALIZATION_ROUTES.apps}>
                <IconApps className='me-1.5 size-4' />
                {t('allApps')}
              </Link>
            </Button>
          </Flex>
        </Flex>

        <Grid className='grid-cols-1 gap-4 md:grid-cols-3'>
          {PERSONALIZATION_FEATURE_KEYS.map((key) => (
            <PlatformCard
              key={key}
              icon={FEATURE_ICONS[key]}
              title={t(`cards.${key}.title`)}
              description={t(`cards.${key}.description`)}
              badge={t(`cards.${key}.badge`)}
              recommended={key === 'memory' && isAuthenticated}
              actionLabel={t(`cards.${key}.action`)}
              href={PERSONALIZATION_ROUTES[key]}
              helperText={
                key === 'memory' && !isAuthenticated ? t('cards.memory.signInHint') : undefined
              }
            />
          ))}
        </Grid>
      </div>
    </section>
  );
}
