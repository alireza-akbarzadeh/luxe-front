'use client';

import { IconChevronRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { useAuth } from '@/components/providers/auth-provider';
import { NotificationsInbox } from '@/domains/notifications/components/notifications-inbox';
import { NotificationsSkeleton } from '@/domains/notifications/components/notifications-skeleton';

import { NotificationsGuestState } from './components/notifications-guest-state';

export function NotificationsDomain() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const t = useTranslations('notifications.page');

  if (isAuthLoading) {
    return (
      <main className='app-container pt-24 pb-16'>
        <NotificationsSkeleton />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <NotificationsGuestState />;
  }

  return (
    <main className='app-container pt-24 pb-16'>
      <DynamicBreadcrumb
        items={[{ label: t('breadcrumb') }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground mb-8 text-xs'
        breadcrumbClassName='flex items-center gap-1.5'
      />

      <NotificationsInbox />
    </main>
  );
}
