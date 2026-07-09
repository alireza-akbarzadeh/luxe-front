'use client';

import {
  IconBell,
  IconChevronRight,
  IconExternalLink,
  IconRefresh,
  IconWifi,
  IconWifiOff
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import type { AccountNotification } from '@/domains/account/api/account-notifications-api';
import {
  formatNotificationTime,
  formatNotificationType,
  getNotificationTypeStyle
} from '@/domains/account/lib/notification-utils';
import { useAdminNotificationActions } from '@/domains/admin/hooks/use-admin-notifications';
import { useRealtime } from '@/lib/realtime/realtime-provider';
import { cn } from '@/lib/utils';

interface NotificationListProps {
  notifications: AccountNotification[];
  total: number;
  unreadOnPage: number;
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
}

export function NotificationList({
  notifications,
  total,
  unreadOnPage,
  isLoading,
  isError,
  onRefresh
}: NotificationListProps) {
  const t = useTranslations('adminShell.notifications');
  const { status: socketStatus } = useRealtime();
  const { markAsRead, markAllRead, isMarkingAllRead } = useAdminNotificationActions();

  return (
    <>
      <div className='border-border/60 bg-muted/20 flex items-start justify-between gap-3 border-b px-4 py-3'>
        <div>
          <p className='text-sm font-bold'>{t('title')}</p>
          <p className='text-muted-foreground text-[11px]'>
            {t('totalUnread', { total, unread: unreadOnPage })}
          </p>
          <div className='text-muted-foreground mt-1 inline-flex items-center gap-1 text-[10px]'>
            {socketStatus === 'connected' ? (
              <>
                <IconWifi className='size-3 text-emerald-600 dark:text-emerald-400' />
                {t('live')}
              </>
            ) : (
              <>
                <IconWifiOff className='size-3' />
                {socketStatus === 'connecting' ? t('connecting') : t('offline')}
              </>
            )}
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 rounded-lg'
            aria-label={t('refresh')}
            onClick={onRefresh}
          >
            <IconRefresh className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 text-[10px] font-bold uppercase'
            disabled={isMarkingAllRead || unreadOnPage === 0}
            onClick={() => void markAllRead()}
          >
            {t('markAllRead')}
          </Button>
        </div>
      </div>

      <ScrollArea className='max-h-80'>
        {isLoading ? (
          <div className='space-y-2 p-3'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-16 w-full rounded-xl' />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className='px-4 py-10 text-center'>
            <p className='text-destructive text-sm font-medium'>{t('loadFailed')}</p>
            <Button variant='outline' size='sm' className='mt-3 rounded-lg' onClick={onRefresh}>
              {t('retry')}
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && notifications.length === 0 ? (
          <div className='flex flex-col items-center px-4 py-14 text-center'>
            <div className='bg-muted/40 mb-3 rounded-full p-3'>
              <IconBell className='text-muted-foreground h-6 w-6' />
            </div>
            <p className='text-sm font-medium'>{t('emptyTitle')}</p>
            <p className='text-muted-foreground mt-1 text-xs'>{t('emptyDescription')}</p>
          </div>
        ) : null}

        {!isLoading && !isError
          ? notifications.map((notification) => (
              <button
                key={notification.id}
                type='button'
                onClick={() => {
                  if (!notification.is_read) void markAsRead(notification.id);
                }}
                className={cn(
                  'border-border/40 hover:bg-muted/40 flex w-full flex-col gap-2 border-b px-4 py-3 text-left transition-colors',
                  !notification.is_read && 'bg-primary/5'
                )}
              >
                <div className='flex items-start justify-between gap-2'>
                  <p className='text-sm leading-snug font-semibold'>{notification.title}</p>
                  {!notification.is_read ? (
                    <span className='bg-primary mt-1 size-2 shrink-0 rounded-full' />
                  ) : null}
                </div>
                <p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
                  {notification.message}
                </p>
                <div className='flex items-center justify-between gap-2'>
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase',
                      getNotificationTypeStyle(notification.type)
                    )}
                  >
                    {formatNotificationType(notification.type)}
                  </span>
                  <span className='text-muted-foreground text-[10px]'>
                    {formatNotificationTime(notification.created_at)}
                  </span>
                </div>
              </button>
            ))
          : null}
      </ScrollArea>

      <div className='border-border/60 bg-muted/10 grid grid-cols-2 gap-2 border-t p-2'>
        <Button
          asChild
          variant='outline'
          size='sm'
          className='h-9 rounded-xl text-[10px] font-bold uppercase'
        >
          <Link href='/dashboard/notifications'>
            {t('viewAll')}
            <IconChevronRight className='ml-1 h-3.5 w-3.5' />
          </Link>
        </Button>
        <Button
          asChild
          variant='outline'
          size='sm'
          className='h-9 rounded-xl text-[10px] font-bold uppercase'
        >
          <Link href='/dashboard/live'>
            {t('liveFeed')}
            <IconExternalLink className='ml-1 h-3.5 w-3.5' />
          </Link>
        </Button>
      </div>
    </>
  );
}
