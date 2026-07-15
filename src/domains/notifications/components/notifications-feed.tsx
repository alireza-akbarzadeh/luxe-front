'use client';

import { IconBell, IconChevronDown } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Text, Typography } from '@/components/ui/typography';
import type { AccountNotification } from '@/domains/account/api/account-notifications-api';
import { NotificationCard } from '@/domains/notifications/components/notification-card';
import { NotificationsPushPromo } from '@/domains/notifications/components/notifications-sidebar';
import type {
  NotificationCategory,
  NotificationReadFilter
} from '@/domains/notifications/lib/notification-categories';

interface NotificationsFeedProps {
  category: NotificationCategory;
  readFilter: NotificationReadFilter;
  notifications: AccountNotification[];
  filteredCount: number;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  isMarkingRead: boolean;
  onReadFilterChange: (value: NotificationReadFilter) => void;
  onMarkRead: (id: number) => void;
  onLoadMore: () => void;
}

export function NotificationsFeed({
  category,
  readFilter,
  notifications,
  filteredCount,
  hasMore,
  isFetchingNextPage,
  isMarkingRead,
  onReadFilterChange,
  onMarkRead,
  onLoadMore
}: NotificationsFeedProps) {
  const t = useTranslations('notifications.inbox');
  const tCategories = useTranslations('notifications.inbox.categories');

  return (
    <section className='min-w-0 space-y-4'>
      <div className='lg:hidden'>
        <NotificationsPushPromo />
      </div>

      <Flex align='center' justify='between' gap={3} className='flex-row'>
        <Typography.H3 className='text-lg font-semibold'>
          {t('feedCount', { count: filteredCount })}
        </Typography.H3>

        <Flex align='center' gap={2} className='flex-row'>
          <Text variant='muted' className='text-sm'>
            {t('filterBy')}
          </Text>
          <Select
            value={readFilter}
            onValueChange={(value) => onReadFilterChange(value as NotificationReadFilter)}
          >
            <SelectTrigger className='h-9 w-[130px] rounded-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>{t('filters.all')}</SelectItem>
              <SelectItem value='unread'>{t('filters.unread')}</SelectItem>
              <SelectItem value='read'>{t('filters.read')}</SelectItem>
            </SelectContent>
          </Select>
        </Flex>
      </Flex>

      {notifications.length === 0 ? (
        <div className='bg-card/40 border-border rounded-2xl border p-10 text-center sm:p-14'>
          <div className='bg-muted/60 mx-auto mb-5 flex size-16 items-center justify-center rounded-full'>
            <IconBell className='text-muted-foreground size-8' />
          </div>
          <Typography.H3 className='font-display text-xl font-semibold'>
            {t('emptyTitle')}
          </Typography.H3>
          <Text variant='muted' className='mx-auto mt-2 max-w-sm text-sm'>
            {t('emptyDescription', { category: tCategories(category) })}
          </Text>
        </div>
      ) : (
        <div className='space-y-3'>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isMarkingRead={isMarkingRead}
              onMarkRead={onMarkRead}
            />
          ))}
        </div>
      )}

      {hasMore ? (
        <Flex justify='center' className='pt-2'>
          <Button
            variant='outline'
            className='rounded-full'
            disabled={isFetchingNextPage}
            onClick={onLoadMore}
          >
            {isFetchingNextPage ? t('loadingMore') : t('loadMore')}
            <IconChevronDown className='size-4' />
          </Button>
        </Flex>
      ) : null}
    </section>
  );
}
