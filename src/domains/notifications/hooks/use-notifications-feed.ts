'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchAccountNotifications,
  markAccountNotificationRead,
  markAllAccountNotificationsRead
} from '@/domains/account/api/account-notifications-api';
import { ACCOUNT_NOTIFICATIONS_QUERY_KEY } from '@/domains/account/hooks/use-account-notifications';

const DEFAULT_PAGE_SIZE = 10;
const COUNT_SAMPLE_LIMIT = 100;

export function useNotificationsFeed(pageSize = DEFAULT_PAGE_SIZE) {
  const queryClient = useQueryClient();

  const feedQuery = useInfiniteQuery({
    queryKey: [...ACCOUNT_NOTIFICATIONS_QUERY_KEY, 'infinite', pageSize],
    queryFn: ({ pageParam = 0 }) =>
      fetchAccountNotifications({ limit: pageSize, offset: pageParam }),
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.notifications.length;
      return nextOffset < lastPage.total ? nextOffset : undefined;
    },
    initialPageParam: 0
  });

  const countsQuery = useQuery({
    queryKey: [...ACCOUNT_NOTIFICATIONS_QUERY_KEY, 'category-counts'],
    queryFn: () => fetchAccountNotifications({ limit: COUNT_SAMPLE_LIMIT, offset: 0 }),
    staleTime: 30_000
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => markAccountNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllAccountNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
    }
  });

  const notifications = feedQuery.data?.pages.flatMap((page) => page.notifications) ?? [];
  const total = feedQuery.data?.pages[0]?.total ?? countsQuery.data?.total ?? 0;
  const countSample = countsQuery.data?.notifications ?? [];
  const hasMore = feedQuery.hasNextPage ?? false;

  return {
    notifications,
    total,
    countSample,
    hasMore,
    isLoading: feedQuery.isLoading,
    isError: feedQuery.isError,
    isFetchingNextPage: feedQuery.isFetchingNextPage,
    refetch: feedQuery.refetch,
    loadMore: feedQuery.fetchNextPage,
    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingRead: markAsReadMutation.isPending,
    markAllRead: markAllReadMutation.mutateAsync,
    isMarkingAllRead: markAllReadMutation.isPending
  };
}
