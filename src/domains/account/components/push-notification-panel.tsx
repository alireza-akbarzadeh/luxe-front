'use client';

import { IconBellRinging, IconBellOff, IconSend } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

import { usePushNotifications } from '../hooks/use-push-notifications';

export function PushNotificationPanel() {
  const t = useTranslations('pwa.push');
  const {
    supportStatus,
    isSubscribed,
    isLoading,
    isPending,
    isTesting,
    toggle,
    sendTest
  } = usePushNotifications();

  if (supportStatus === 'unsupported') {
    return (
      <div className='bg-muted/40 border-border rounded-2xl border p-5'>
        <Flex align='center' gap={3}>
          <IconBellOff className='text-muted-foreground size-5 shrink-0' />
          <Typography.Small className='text-muted-foreground'>{t('unsupported')}</Typography.Small>
        </Flex>
      </div>
    );
  }

  const handleToggle = async () => {
    try {
      await toggle();
      toast.success(isSubscribed ? t('disabledSuccess') : t('enabledSuccess'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('error');
      toast.error(message);
    }
  };

  const handleTest = async () => {
    try {
      await sendTest();
      toast.success(t('testSent'));
    } catch {
      toast.error(t('testError'));
    }
  };

  return (
    <div className='bg-card border-border rounded-2xl border p-5 sm:p-6'>
      <Flex direction='column' gap={4}>
        <Flex align='start' justify='between' gap={4} className='flex-wrap'>
          <Flex direction='column' gap={1}>
            <Flex align='center' gap={2}>
              <IconBellRinging className='text-primary size-5' />
              <Typography.Large className='font-semibold'>{t('title')}</Typography.Large>
            </Flex>
            <Typography.Small className='text-muted-foreground max-w-xl'>
              {isSubscribed ? t('descriptionEnabled') : t('descriptionDisabled')}
            </Typography.Small>
            {supportStatus === 'denied' ? (
              <Typography.Small className='text-destructive'>{t('permissionDenied')}</Typography.Small>
            ) : null}
          </Flex>

          <Button
            variant={isSubscribed ? 'outline' : 'default'}
            className='rounded-full'
            disabled={isLoading || isPending || supportStatus === 'denied'}
            onClick={() => void handleToggle()}
          >
            {isPending ? t('working') : isSubscribed ? t('disable') : t('enable')}
          </Button>
        </Flex>

        {isSubscribed ? (
          <Flex align='center' gap={2}>
            <Button
              variant='secondary'
              size='sm'
              className='rounded-full'
              disabled={isTesting}
              onClick={() => void handleTest()}
            >
              <IconSend className='size-4' />
              {isTesting ? t('sendingTest') : t('sendTest')}
            </Button>
          </Flex>
        ) : null}
      </Flex>
    </div>
  );
}
