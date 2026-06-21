'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { postAccountPushTest } from '@/services/-account-push-test-post';
import {
  getActivePushSubscription,
  getPushSupportStatus,
  subscribeToWebPush,
  unsubscribeFromWebPush,
  type PushSupportStatus
} from '@/lib/pwa/push-subscription';

export const PUSH_SUBSCRIPTION_QUERY_KEY = ['push-subscription'] as const;

export function usePushNotifications() {
  const queryClient = useQueryClient();
  const [supportStatus, setSupportStatus] = useState<PushSupportStatus>('unsupported');

  useEffect(() => {
    setSupportStatus(getPushSupportStatus());
  }, []);

  const subscriptionQuery = useQuery({
    queryKey: PUSH_SUBSCRIPTION_QUERY_KEY,
    queryFn: getActivePushSubscription,
    enabled: supportStatus !== 'unsupported'
  });

  const subscribeMutation = useMutation({
    mutationFn: subscribeToWebPush,
    onSuccess: async () => {
      setSupportStatus(getPushSupportStatus());
      await queryClient.invalidateQueries({ queryKey: PUSH_SUBSCRIPTION_QUERY_KEY });
    }
  });

  const unsubscribeMutation = useMutation({
    mutationFn: unsubscribeFromWebPush,
    onSuccess: async () => {
      setSupportStatus(getPushSupportStatus());
      await queryClient.invalidateQueries({ queryKey: PUSH_SUBSCRIPTION_QUERY_KEY });
    }
  });

  const testMutation = useMutation({
    mutationFn: () => postAccountPushTest()
  });

  const isSubscribed = Boolean(subscriptionQuery.data);

  const toggle = useCallback(async () => {
    if (isSubscribed) {
      await unsubscribeMutation.mutateAsync();
      return;
    }

    await subscribeMutation.mutateAsync();
  }, [isSubscribed, subscribeMutation, unsubscribeMutation]);

  return {
    supportStatus,
    isSubscribed,
    isLoading: subscriptionQuery.isLoading,
    isPending: subscribeMutation.isPending || unsubscribeMutation.isPending,
    isTesting: testMutation.isPending,
    toggle,
    sendTest: testMutation.mutateAsync,
    refetch: subscriptionQuery.refetch
  };
}
