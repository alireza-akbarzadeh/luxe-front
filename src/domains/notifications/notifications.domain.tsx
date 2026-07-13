'use client';

import { IconChevronRight } from '@tabler/icons-react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { useAuth } from '@/components/providers/auth-provider';
import { AccountNotifications } from '@/domains/account/containers/account-notifications';

import { NotificationsGuestState } from './components/notifications-guest-state';

export function NotificationsDomain() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <main className='app-container pt-24 pb-16'>
        <div className='mx-auto max-w-3xl space-y-4'>
          <div className='bg-muted h-4 w-40 animate-pulse rounded' />
          <div className='bg-muted h-24 w-full animate-pulse rounded-2xl' />
          <div className='bg-muted h-24 w-full animate-pulse rounded-2xl' />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <NotificationsGuestState />;
  }

  return (
    <main className='app-container pt-24 pb-16'>
      <DynamicBreadcrumb
        items={[{ label: 'Notifications' }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground mb-8 text-xs'
        breadcrumbClassName='flex items-center gap-1.5'
      />

      <div className='mx-auto max-w-3xl'>
        <AccountNotifications />
      </div>
    </main>
  );
}
