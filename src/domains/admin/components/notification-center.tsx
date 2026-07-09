'use client';

import { IconBell } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { AdminShellPanel } from '@/domains/admin/components/admin-shell-panel';
import { useAdminNotificationsPanel } from '@/domains/admin/hooks/use-admin-notifications';
import { useAdminShellStore } from '@/domains/admin/stores/admin-shell-store';
import { cn } from '@/lib/utils';

import { NotificationList } from '../sections/notification-list';

export function NotificationCenter() {
  const t = useTranslations('adminShell.notifications');
  const isOpen = useAdminShellStore((state) => state.notificationOpen);
  const setNotificationOpen = useAdminShellStore((state) => state.setNotificationOpen);

  const { notifications, total, isLoading, isError, refetch, unreadOnPage } =
    useAdminNotificationsPanel();

  const unreadTotal = notifications.filter((item) => !item.is_read).length;

  return (
    <AdminShellPanel
      open={isOpen}
      onOpenChange={setNotificationOpen}
      title={t('title')}
      desktopSurface='popover'
      trigger={
        <Button
          size='icon'
          variant='ghost'
          aria-label={t('title')}
          className='relative h-9 w-9 rounded-xl'
        >
          <IconBell className={cn('h-5 w-5', unreadTotal > 0 && 'text-primary')} />
          {unreadTotal > 0 ? (
            <span className='bg-primary text-primary-foreground ring-background absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ring-2'>
              {unreadTotal > 9 ? '9+' : unreadTotal}
            </span>
          ) : null}
        </Button>
      }
    >
      <NotificationList
        notifications={notifications}
        total={total}
        unreadOnPage={unreadOnPage}
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => void refetch()}
      />
    </AdminShellPanel>
  );
}
