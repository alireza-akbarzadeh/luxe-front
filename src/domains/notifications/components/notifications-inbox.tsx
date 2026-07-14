'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { NotificationsFeed } from '@/domains/notifications/components/notifications-feed';
import { NotificationsHeader } from '@/domains/notifications/components/notifications-header';
import { NotificationsSidebar } from '@/domains/notifications/components/notifications-sidebar';
import { NotificationsSkeleton } from '@/domains/notifications/components/notifications-skeleton';
import { NotificationsTabs } from '@/domains/notifications/components/notifications-tabs';
import { useNotificationCategory } from '@/domains/notifications/hooks/use-notification-category';
import { useNotificationsFeed } from '@/domains/notifications/hooks/use-notifications-feed';
import {
  countNotificationsByCategory,
  filterNotificationsByCategory,
  filterNotificationsByReadState
} from '@/domains/notifications/lib/notification-categories';

/** Shared notifications inbox for /notifications and account tab. */
export function NotificationsInbox() {
  const t = useTranslations('notifications.inbox');
  const tAccount = useTranslations('account.notifications');
  const { category, setCategory, readFilter, setReadFilter } = useNotificationCategory();

  const {
    notifications,
    total,
    countSample,
    hasMore,
    isLoading,
    isError,
    isFetchingNextPage,
    refetch,
    loadMore,
    markAsRead,
    isMarkingRead,
    markAllRead,
    isMarkingAllRead
  } = useNotificationsFeed();

  const categoryCounts = useMemo(() => {
    const counts = countNotificationsByCategory(countSample);
    counts.all = total;
    return counts;
  }, [countSample, total]);

  const filteredNotifications = useMemo(() => {
    const byCategory = filterNotificationsByCategory(notifications, category);
    return filterNotificationsByReadState(byCategory, readFilter);
  }, [category, notifications, readFilter]);

  const unreadCount = useMemo(
    () => countSample.filter((item) => !item.is_read).length,
    [countSample]
  );

  const handleMarkRead = async (id: number) => {
    try {
      await markAsRead(id);
    } catch {
      toast.error(tAccount('markReadFailed'));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success(tAccount('markAllReadSuccess'));
    } catch {
      toast.error(tAccount('markAllReadFailed'));
    }
  };

  if (isLoading) {
    return <NotificationsSkeleton />;
  }

  if (isError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-12'>
        <p className='text-destructive font-medium'>{t('loadError')}</p>
        <Button variant='outline' className='mt-5 rounded-full' onClick={() => void refetch()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <NotificationsHeader
        total={total}
        unreadCount={unreadCount}
        isMarkingAllRead={isMarkingAllRead}
        onMarkAllRead={() => void handleMarkAllRead()}
        onRefresh={() => void refetch()}
      />

      <NotificationsTabs
        activeCategory={category}
        counts={categoryCounts}
        onCategoryChange={setCategory}
      />

      <div className='grid gap-8 lg:grid-cols-[260px_1fr]'>
        <NotificationsSidebar
          activeCategory={category}
          counts={categoryCounts}
          onCategoryChange={setCategory}
        />

        <NotificationsFeed
          category={category}
          readFilter={readFilter}
          notifications={filteredNotifications}
          filteredCount={
            category === 'all' && readFilter === 'all' ? total : filteredNotifications.length
          }
          hasMore={hasMore}
          isFetchingNextPage={isFetchingNextPage}
          isMarkingRead={isMarkingRead}
          onReadFilterChange={setReadFilter}
          onMarkRead={(id) => void handleMarkRead(id)}
          onLoadMore={() => void loadMore()}
        />
      </div>
    </div>
  );
}
