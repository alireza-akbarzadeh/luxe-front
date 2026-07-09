'use client';

import { IconBell, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import {
  formatNotificationTime,
  formatNotificationType,
  getNotificationTypeStyle
} from '@/domains/account/lib/notification-utils';
import {
  useAdminNotificationActions,
  useAdminNotificationsPanel
} from '@/domains/admin/hooks/use-admin-notifications';
import { cn } from '@/lib/utils';

const HOME_NOTIFICATION_LIMIT = 5;

/** Recent notifications widget for the dashboard home page. */
export function DashboardNotificationsSection() {
  const { notifications, isLoading, isError, refetch } = useAdminNotificationsPanel();
  const { markAsRead } = useAdminNotificationActions();
  const items = notifications.slice(0, HOME_NOTIFICATION_LIMIT);

  return (
    <Card className='dashboard-card border-0 shadow-none'>
      <CardHeader>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Latest alerts from orders, inventory, and system events
            </CardDescription>
          </div>
          <Link
            href='/dashboard/notifications'
            className='text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline'
          >
            View all
            <IconChevronRight className='size-3.5' />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className='h-14 w-full rounded-xl' />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className='py-6 text-center'>
            <Text variant='muted' className='text-sm'>
              Could not load notifications.
            </Text>
            <button
              type='button'
              className='text-primary mt-2 text-xs font-semibold hover:underline'
              onClick={() => void refetch()}
            >
              Retry
            </button>
          </div>
        ) : null}

        {!isLoading && !isError && items.length === 0 ? (
          <div className='flex flex-col items-center py-8 text-center'>
            <div className='bg-muted/40 mb-3 rounded-full p-3'>
              <IconBell className='text-muted-foreground h-5 w-5' />
            </div>
            <Text variant='small' className='font-medium'>
              No notifications yet
            </Text>
            <Text variant='muted' className='mt-1 text-xs'>
              New alerts will appear here as activity happens.
            </Text>
          </div>
        ) : null}

        {!isLoading && !isError && items.length > 0 ? (
          <div className='space-y-2'>
            {items.map((notification) => (
              <button
                key={notification.id}
                type='button'
                onClick={() => {
                  if (!notification.is_read) void markAsRead(notification.id);
                }}
                className={cn(
                  'hover:bg-muted/30 flex w-full flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors',
                  !notification.is_read && 'border-primary/20 bg-primary/5'
                )}
              >
                <div className='flex items-start justify-between gap-2'>
                  <Text variant='small' className='font-semibold'>
                    {notification.title}
                  </Text>
                  {!notification.is_read ? (
                    <span className='bg-primary mt-1 size-2 shrink-0 rounded-full' />
                  ) : null}
                </div>
                <Text variant='muted' className='line-clamp-2 text-xs'>
                  {notification.message}
                </Text>
                <div className='flex items-center justify-between gap-2'>
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase',
                      getNotificationTypeStyle(notification.type)
                    )}
                  >
                    {formatNotificationType(notification.type)}
                  </span>
                  <Text variant='muted' className='text-[10px]'>
                    {formatNotificationTime(notification.created_at)}
                  </Text>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
