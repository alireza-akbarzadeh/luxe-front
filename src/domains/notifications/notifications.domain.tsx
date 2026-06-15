'use client';

import { IconChevronRight } from '@tabler/icons-react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { useAuth } from '@/components/providers/auth-provider';
import { AccountNotifications } from '@/domains/account/containers/account-notifications';

import { NotificationsGuestState } from './components/notifications-guest-state';

export function NotificationsDomain() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <NotificationsGuestState />;
  }

  return (
    <main className='-mx-4 px-4 pb-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
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
