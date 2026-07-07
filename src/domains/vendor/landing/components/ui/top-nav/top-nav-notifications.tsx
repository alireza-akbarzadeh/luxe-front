'use client';

import { IconBell } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAccountNotifications } from '@/domains/account/hooks/use-account-notifications';
import {
  formatNotificationTime,
  formatNotificationType,
  getNotificationTypeStyle
} from '@/domains/account/lib/notification-utils';
import { cn } from '@/lib/utils';

import { iconButtonClass } from '../constants';

export function TopNavNotifications() {
  const t = useTranslations('vendor.panel.topNav');
  const {
    notifications,
    unreadOnPage: unreadCount,
    isLoading: notificationsLoading
  } = useAccountNotifications(8, 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className={cn(iconButtonClass, 'relative')}
          aria-label={t('notifications')}
        >
          <IconBell className='size-[18px]' />
          {unreadCount > 0 ? (
            <span className='bg-gold text-gold-foreground ring-background absolute end-1 top-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium ring-2'>
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80 overflow-hidden p-0'>
        <div className='border-b px-4 py-3'>
          <p className='text-sm font-semibold'>{t('notifications')}</p>
        </div>
        <ul className='max-h-80 divide-y overflow-y-auto'>
          {notificationsLoading ? (
            <li className='text-muted-foreground px-4 py-6 text-center text-sm'>…</li>
          ) : notifications.length === 0 ? (
            <li className='text-muted-foreground px-4 py-10 text-center text-sm'>
              {t('noNotifications')}
            </li>
          ) : (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className={cn(
                  'hover:bg-muted/40 relative px-4 py-3 transition-colors',
                  !notification.is_read && 'bg-muted/30'
                )}
              >
                {!notification.is_read && (
                  <span className='bg-gold absolute top-4 left-1.5 size-1.5 rounded-full' />
                )}
                <p className='text-sm font-medium'>{notification.title}</p>
                <p className='text-muted-foreground mt-0.5 line-clamp-2 text-xs'>
                  {notification.message}
                </p>
                <div className='mt-2 flex items-center justify-between gap-2'>
                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                      getNotificationTypeStyle(notification.type)
                    )}
                  >
                    {formatNotificationType(notification.type)}
                  </span>
                  <p className='text-muted-foreground text-[10px]'>
                    {formatNotificationTime(notification.created_at)}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className='border-t p-2'>
          <Button variant='ghost' size='sm' className='w-full' asChild>
            <Link href='/vendor/panel/notifications'>{t('viewAllNotifications')}</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
