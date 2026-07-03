'use client';

import { IconBrandAndroid, IconBrandApple, IconBrowser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Grid } from '@/components/ui/grid';
import { usePlatformInfo } from '@/lib/pwa/use-platform-info';

import { PlatformCard } from './platform-card';
import { PwaInstallCard } from './pwa-install-button';

export function PlatformCardsGrid() {
  const t = useTranslations('platforms.cards');
  const { isIos, isAndroid } = usePlatformInfo();

  return (
    <Grid className='grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
      <PlatformCard
        icon={<IconBrowser className='size-5' />}
        title={t('web.title')}
        description={t('web.description')}
        badge={!isIos && !isAndroid ? t('web.recommended') : undefined}
        recommended={!isIos && !isAndroid}
        actionLabel={t('web.action')}
        href='/shop'
      />

      <PlatformCard
        icon={<IconBrandApple className='size-5' />}
        title={t('ios.title')}
        description={t('ios.description')}
        badge={isIos ? t('ios.recommended') : t('comingSoon')}
        recommended={isIos}
        actionLabel={t('comingSoon')}
        disabled
      />

      <PlatformCard
        icon={<IconBrandAndroid className='size-5' />}
        title={t('android.title')}
        description={t('android.description')}
        badge={isAndroid ? t('android.recommended') : t('comingSoon')}
        recommended={isAndroid}
        actionLabel={t('comingSoon')}
        disabled
      />

      <PwaInstallCard />
    </Grid>
  );
}
