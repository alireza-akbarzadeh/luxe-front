'use client';

import {
  IconBell,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconWifi,
  IconWifiOff
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useRealtime } from '@/lib/realtime/realtime-provider';

import { AccountNotificationRow } from '../components/account-notification-row';
import { AccountNotificationsSkeleton } from '../components/account-notifications-skeleton';
import { PushNotificationPanel } from '../components/push-notification-panel';
import { useAccountNotifications } from '../hooks/use-account-notifications';

const PAGE_SIZE = 8;

export function AccountNotifications() {
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;
  const { status: socketStatus } = useRealtime();
  const t = useTranslations('account.notifications');
  const tCommon = useTranslations('account.common');

  const {
    notifications,
    total,
    unreadOnPage,
    isLoading,
    isError,
    refetch,
    markAsRead,
    isMarkingRead,
    markAllRead,
    isMarkingAllRead
  } = useAccountNotifications(PAGE_SIZE, offset);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleMarkRead = async (id: number) => {
    try {
      await markAsRead(id);
    } catch {
      toast.error(t('markReadFailed'));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success(t('markAllReadSuccess'));
    } catch {
      toast.error(t('markAllReadFailed'));
    }
  };

  const handlePrev = () => setPage((current) => Math.max(0, current - 1));
  const handleNext = () => setPage((current) => Math.min(totalPages - 1, current + 1));

  if (isLoading) {
    return <AccountNotificationsSkeleton />;
  }

  if (isError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-12'>
        <p className='text-destructive font-medium'>{t('loadError')}</p>
        <p className='text-muted-foreground mt-2 text-sm'>{tCommon('connectionError')}</p>
        <Button variant='outline' className='mt-5 rounded-full' onClick={() => void refetch()}>
          {tCommon('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PushNotificationPanel />

      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h2 className='font-display text-2xl font-semibold tracking-tight'>{t('title')}</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t('subtitle', { total, unread: unreadOnPage })}
          </p>
          <div className='text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-xs'>
            {socketStatus === 'connected' ? (
              <>
                <IconWifi className='size-3.5 text-emerald-600 dark:text-emerald-400' />
                {t('liveConnected')}
              </>
            ) : (
              <>
                <IconWifiOff className='size-3.5' />
                {socketStatus === 'connecting' ? t('liveConnecting') : t('liveOffline')}
              </>
            )}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full'
            disabled={isMarkingAllRead || unreadOnPage === 0}
            onClick={() => void handleMarkAllRead()}
          >
            {t('markAllRead')}
          </Button>
          <Button
            variant='ghost'
            size='icon-sm'
            className='rounded-full'
            aria-label={t('refreshAria')}
            onClick={() => void refetch()}
          >
            <IconRefresh className='size-4' />
          </Button>
          {totalPages > 1 ? (
            <div className='flex items-center gap-1'>
              <Button variant='outline' size='icon-sm' onClick={handlePrev} disabled={page === 0}>
                <IconChevronLeft className='cn-rtl-flip size-4' />
              </Button>
              <span className='text-muted-foreground min-w-24 text-center text-sm tabular-nums'>
                {tCommon('pageOf', { current: page + 1, total: totalPages })}
              </span>
              <Button
                variant='outline'
                size='icon-sm'
                onClick={handleNext}
                disabled={page + 1 >= totalPages}
              >
                <IconChevronRight className='cn-rtl-flip size-4' />
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-14'>
          <div className='bg-muted/60 mx-auto mb-5 flex size-16 items-center justify-center rounded-full'>
            <IconBell className='text-muted-foreground size-8' />
          </div>
          <h3 className='font-display text-xl font-semibold'>{t('emptyTitle')}</h3>
          <p className='text-muted-foreground mx-auto mt-2 max-w-sm text-sm'>{t('emptyDescription')}</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {notifications.map((notification) => (
            <AccountNotificationRow
              key={notification.id}
              notification={notification}
              isMarkingRead={isMarkingRead}
              onMarkRead={(id) => void handleMarkRead(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
