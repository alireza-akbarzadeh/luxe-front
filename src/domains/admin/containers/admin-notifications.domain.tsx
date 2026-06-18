'use client';

import { IconBell, IconRefresh, IconWifi, IconWifiOff } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { AccountNotificationRow } from '@/domains/account/components/account-notification-row';
import { AccountNotificationsSkeleton } from '@/domains/account/components/account-notifications-skeleton';
import { useAccountNotifications } from '@/domains/account/hooks/use-account-notifications';
import { useRealtime } from '@/lib/realtime/realtime-provider';

const PAGE_SIZE = 10;

export function AdminNotificationsDomain() {
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;
  const { status: socketStatus } = useRealtime();

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
      toast.error('Unable to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Unable to mark all as read');
    }
  };

  if (isLoading) return <AccountNotificationsSkeleton />;

  if (isError) {
    return (
      <div className='border-border/60 rounded-2xl border p-10 text-center'>
        <p className='text-destructive font-medium'>Failed to load notifications.</p>
        <Button variant='outline' className='mt-4 rounded-xl' onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <div className='mb-2 flex items-center gap-2'>
            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl'>
              <IconBell className='text-primary h-5 w-5' />
            </div>
            <div>
              <h1 className='text-xl font-black tracking-tight'>Notifications</h1>
              <p className='text-muted-foreground text-[11px] font-bold tracking-widest uppercase'>
                Admin inbox
              </p>
            </div>
          </div>
          <p className='text-muted-foreground text-sm'>
            {total} total · {unreadOnPage} unread on this page
          </p>
          <div className='text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-xs'>
            {socketStatus === 'connected' ? (
              <>
                <IconWifi className='size-3.5 text-emerald-600 dark:text-emerald-400' />
                Live updates connected
              </>
            ) : (
              <>
                <IconWifiOff className='size-3.5' />
                {socketStatus === 'connecting' ? 'Connecting…' : 'Live updates offline'}
              </>
            )}
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='rounded-xl'
            disabled={isMarkingAllRead || unreadOnPage === 0}
            onClick={() => void handleMarkAllRead()}
          >
            Mark all read
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-xl'
            aria-label='Refresh'
            onClick={() => void refetch()}
          >
            <IconRefresh className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className='border-border/60 rounded-2xl border border-dashed py-16 text-center'>
          <p className='text-sm font-medium'>No notifications yet</p>
          <p className='text-muted-foreground mt-1 text-xs'>
            Order and account alerts assigned to your user will show up here.
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {notifications.map((notification) => (
            <AccountNotificationRow
              key={notification.id}
              notification={notification}
              isMarkingRead={isMarkingRead}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className='flex items-center justify-between'>
          <Button
            variant='outline'
            size='sm'
            className='rounded-xl'
            disabled={page === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
          >
            Previous
          </Button>
          <p className='text-muted-foreground text-xs'>
            Page {page + 1} of {totalPages}
          </p>
          <Button
            variant='outline'
            size='sm'
            className='rounded-xl'
            disabled={page >= totalPages - 1}
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
