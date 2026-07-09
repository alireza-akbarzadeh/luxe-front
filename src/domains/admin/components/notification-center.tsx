'use client';

import { IconBell } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAdminNotificationsPanel } from '@/domains/admin/hooks/use-admin-notifications';
import { useAdminShellStore } from '@/domains/admin/stores/admin-shell-store';
import { cn } from '@/lib/utils';

import { NotificationList } from '../sections/notification-list';

export function NotificationCenter() {
  const isOpen = useAdminShellStore((state) => state.notificationOpen);
  const setNotificationOpen = useAdminShellStore((state) => state.setNotificationOpen);

  const { notifications, total, isLoading, isError, refetch, unreadOnPage } =
    useAdminNotificationsPanel();

  const unreadTotal = notifications.filter((item) => !item.is_read).length;

  return (
    <Popover open={isOpen} onOpenChange={setNotificationOpen}>
      <PopoverTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          aria-label='Notifications'
          className='relative h-10 w-10 rounded-xl'
        >
          <IconBell className={cn('h-5 w-5', unreadTotal > 0 && 'text-primary')} />
          {unreadTotal > 0 ? (
            <span className='bg-primary text-primary-foreground ring-background absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ring-2'>
              {unreadTotal > 9 ? '9+' : unreadTotal}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        className='border-border/60 w-[min(100vw-2rem,24rem)] overflow-hidden rounded-2xl p-0 shadow-xl'
      >
        <NotificationList
          notifications={notifications}
          total={total}
          unreadOnPage={unreadOnPage}
          isLoading={isLoading}
          isError={isError}
          onRefresh={() => void refetch()}
        />
      </PopoverContent>
    </Popover>
  );
}
