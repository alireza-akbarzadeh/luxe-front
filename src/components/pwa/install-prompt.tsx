'use client';

import { IconDownload, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { usePwaInstall } from '@/lib/pwa/use-pwa-install';

const DISMISS_KEY = 'luxe-pwa-install-dismissed';

/** Storefront-only install banner — listens for `beforeinstallprompt`. */
export function PwaInstallPrompt() {
  const t = useTranslations('pwa.install');
  const { canInstall, promptInstall } = usePwaInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!canInstall) {
      setVisible(false);
      return;
    }

    if (window.localStorage.getItem(DISMISS_KEY) === '1') {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [canInstall]);

  const onInstall = async () => {
    if (!canInstall) return;
    await promptInstall();
    setVisible(false);
  };

  const onDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Flex
      align='center'
      justify='between'
      gap={3}
      className='border-border/80 bg-card/95 fixed inset-x-4 bottom-4 z-50 rounded-2xl border p-4 shadow-lg backdrop-blur-sm sm:inset-x-auto sm:end-6 sm:start-auto sm:max-w-sm'
      role='region'
      aria-label={t('ariaLabel')}
    >
      <Flex direction='column' gap={1} className='min-w-0 flex-1 text-start'>
        <Text variant='small' weight='semibold'>
          {t('title')}
        </Text>
        <Text variant='muted'>{t('description')}</Text>
      </Flex>
      <Flex align='center' gap={2} className='shrink-0'>
        <Button type='button' size='sm' variant='brand' onClick={onInstall}>
          <IconDownload aria-hidden className='size-4' />
          {t('action')}
        </Button>
        <Button type='button' size='icon-sm' variant='ghost' onClick={onDismiss}>
          <IconX aria-hidden className='size-4' />
          <span className='sr-only'>{t('dismiss')}</span>
        </Button>
      </Flex>
    </Flex>
  );
}
