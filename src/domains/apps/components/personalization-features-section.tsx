'use client';

import {
  IconBrain,
  IconHomeHeart,
  IconMoodSmile,
  IconRefresh,
  IconTargetArrow
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { PERSONALIZATION_ROUTES } from '@/domains/personalization/lib/personalization-routes';
import { SectionShell } from '@/domains/support/components/section-shell';

import { PlatformCard } from './platform-card';

/** Entry points for Phase 3 personalization features on the apps hub. */
export function PersonalizationFeaturesSection() {
  const t = useTranslations('platforms.personalization');

  return (
    <SectionShell className='mt-14'>
      <Typography.H2 className='font-display mb-2 text-2xl font-semibold tracking-tight'>
        {t('title')}
      </Typography.H2>
      <Typography.Muted className='mb-6 max-w-2xl text-sm leading-relaxed'>
        {t('subtitle')}
      </Typography.Muted>

      <Grid className='grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <PlatformCard
          icon={<IconBrain className='size-5' />}
          title={t('memory.title')}
          description={t('memory.description')}
          badge={t('memory.badge')}
          recommended
          actionLabel={t('memory.action')}
          href={PERSONALIZATION_ROUTES.memory}
        />
        <PlatformCard
          icon={<IconTargetArrow className='size-5' />}
          title={t('goal.title')}
          description={t('goal.description')}
          badge={t('goal.badge')}
          actionLabel={t('goal.action')}
          href={PERSONALIZATION_ROUTES.goal}
        />
        <PlatformCard
          icon={<IconMoodSmile className='size-5' />}
          title={t('mood.title')}
          description={t('mood.description')}
          badge={t('mood.badge')}
          actionLabel={t('mood.action')}
          href={PERSONALIZATION_ROUTES.mood}
        />
        <PlatformCard
          icon={<IconRefresh className='size-5' />}
          title={t('replenishment.title')}
          description={t('replenishment.description')}
          badge={t('replenishment.badge')}
          actionLabel={t('replenishment.action')}
          href={PERSONALIZATION_ROUTES.replenishment}
        />
        <PlatformCard
          icon={<IconHomeHeart className='size-5' />}
          title={t('household.title')}
          description={t('household.description')}
          badge={t('household.badge')}
          actionLabel={t('household.action')}
          href={PERSONALIZATION_ROUTES.household}
        />
      </Grid>
    </SectionShell>
  );
}
