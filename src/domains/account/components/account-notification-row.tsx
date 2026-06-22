'use client';

import { IconBell } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { AccountNotification } from '../api/account-notifications-api';
import {
  formatNotificationDate,
  formatNotificationTime,
  getNotificationTypeStyle
} from '../lib/notification-utils';

interface AccountNotificationRowProps {
  notification: AccountNotification;
  isMarkingRead: boolean;
  onMarkRead: (id: number) => void;
}

function getNotificationTypeKey(type?: string): string {
  if (!type) return 'update';
  const known = ['order_update', 'payment_success', 'payment_failed', 'shipment_update'];
  return known.includes(type) ? type : 'update';
}

export function AccountNotificationRow({
  notification,
  isMarkingRead,
  onMarkRead
}: AccountNotificationRowProps) {
  const t = useTranslations('account.notifications');
  const typeKey = getNotificationTypeKey(notification.type);
  const typeLabel = t(`notificationType.${typeKey}` as 'notificationType.order_update');

  return (
    <div
      className={cn(
        'border-border/60 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between',
        notification.is_read ? 'bg-muted/20' : 'bg-gold/5 border-gold/20'
      )}
    >
      <div className='flex min-w-0 gap-3'>
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            notification.is_read ? 'bg-muted text-muted-foreground' : 'bg-gold/15 text-gold-strong'
          )}
        >
          <IconBell className='size-4' />
        </div>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='font-medium'>{notification.title}</p>
            <span
              className={cn(
                'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase',
                getNotificationTypeStyle(notification.type)
              )}
            >
              {typeLabel}
            </span>
            {!notification.is_read ? (
              <span className='bg-gold size-2 rounded-full' aria-label={t('unreadAria')} />
            ) : null}
          </div>
          <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
            {notification.message}
          </p>
          <p className='text-muted-foreground mt-2 text-xs'>
            {formatNotificationDate(notification.created_at)} ·{' '}
            {formatNotificationTime(notification.created_at)}
          </p>
        </div>
      </div>

      {!notification.is_read ? (
        <Button
          variant='outline'
          size='sm'
          className='rounded-full'
          disabled={isMarkingRead}
          onClick={() => onMarkRead(notification.id)}
        >
          {t('markRead')}
        </Button>
      ) : null}
    </div>
  );
}
