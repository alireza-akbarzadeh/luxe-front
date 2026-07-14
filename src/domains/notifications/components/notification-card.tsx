'use client';

import { useTranslations } from 'next-intl';

import type { AccountNotification } from '@/domains/account/api/account-notifications-api';
import {
  formatNotificationTime,
  getNotificationCardStyle
} from '@/domains/account/lib/notification-utils';
import { getNotificationCategory } from '@/domains/notifications/lib/notification-categories';
import { cn } from '@/lib/utils';

interface NotificationCardProps {
  notification: AccountNotification;
  onMarkRead?: (id: number) => void;
  isMarkingRead?: boolean;
}

export function NotificationCard({
  notification,
  onMarkRead,
  isMarkingRead
}: NotificationCardProps) {
  const t = useTranslations('notifications.inbox');
  const category = getNotificationCategory(notification.type);
  const cardStyle = getNotificationCardStyle(notification.type);
  const Icon = cardStyle.icon;
  const categoryLabel = t(`categories.${category}`);

  const handleClick = () => {
    if (!notification.is_read && onMarkRead && !isMarkingRead) {
      onMarkRead(notification.id);
    }
  };

  return (
    <article
      role='button'
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'group border-border/60 hover:border-border flex cursor-pointer gap-4 rounded-2xl border p-4 transition-colors sm:p-5',
        notification.is_read ? 'bg-card/40' : 'bg-gold/5 border-gold/20'
      )}
    >
      <div
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-full border',
          cardStyle.iconWrap
        )}
      >
        <Icon className='size-5' stroke={1.75} aria-hidden />
      </div>

      <div className='min-w-0 flex-1'>
        <p className={cn('text-[11px] font-semibold tracking-wider uppercase', cardStyle.label)}>
          {categoryLabel}
        </p>
        <h3 className='mt-1 text-sm font-semibold sm:text-base'>{notification.title}</h3>
        <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>{notification.message}</p>
        <p className='text-muted-foreground mt-2 text-xs sm:hidden'>
          {formatNotificationTime(notification.created_at)}
        </p>
      </div>

      <div className='flex shrink-0 flex-col items-end gap-2'>
        <time className='text-muted-foreground hidden text-xs whitespace-nowrap sm:block'>
          {formatNotificationTime(notification.created_at)}
        </time>
        <span
          className={cn(
            'size-2 rounded-full',
            notification.is_read ? 'bg-muted-foreground/30' : 'bg-gold'
          )}
          aria-label={notification.is_read ? t('readState') : t('unreadState')}
        />
      </div>
    </article>
  );
}
