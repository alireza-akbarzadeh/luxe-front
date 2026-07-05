'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useRemoteAppVersion } from '@/hooks/use-remote-app-version';
import { applyAppUpdate } from '@/lib/app-update';
import { formatAppVersionLabel } from '@/lib/app-version';
import { cn } from '@/lib/utils';

type AppVersionUpdateBannerProps = {
  className?: string;
};

/** Inline banner when a newer web/PWA build is published than the one currently loaded. */
export function AppVersionUpdateBanner({ className }: AppVersionUpdateBannerProps) {
  const t = useTranslations('platforms.versionBanner');
  const { currentVersion, acknowledgedBuildId, remote, hasUpdate, isLoading } =
    useRemoteAppVersion();

  if (isLoading || !hasUpdate || !remote) {
    return null;
  }

  const currentLabel = formatAppVersionLabel(currentVersion, acknowledgedBuildId);
  const availableLabel = formatAppVersionLabel(remote.version, remote.buildId);

  return (
    <Flex
      direction='row'
      align='center'
      justify='between'
      spacing={3}
      className={cn(
        'rounded-xl border border-sky-200/80 bg-sky-50 px-4 py-3 text-sky-800 sm:px-5 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-200',
        className
      )}
    >
      <Typography.Text className='text-sm leading-snug'>
        {t('message', { current: currentLabel, available: availableLabel })}
      </Typography.Text>
      <Button
        type='button'
        variant='link'
        size='sm'
        className='h-auto shrink-0 px-0 font-semibold text-sky-700 dark:text-sky-300'
        onClick={() => applyAppUpdate(remote.buildId)}
      >
        {t('action')}
      </Button>
    </Flex>
  );
}
