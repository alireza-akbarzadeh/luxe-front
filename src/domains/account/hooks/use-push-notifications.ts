'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import {
  getActivePushSubscription,
  getPushSupportStatus,
  type PushSupportStatus,
  subscribeToWebPush,
  unsubscribeFromWebPush
} from '@/lib/pwa/push-subscription';
import { postAccountPushTest } from '@/services/-account-push-test-post';

export const PUSH_SUBSCRIPTION_QUERY_KEY = ['push-subscription'] as const;

function readPushSupportStatus(): PushSupportStatus {
  if (typeof window === 'undefined') return 'unsupported';
  return getPushSupportStatus();
}

export function usePushNotifications() {
  const queryClient = useQueryClient();
  const [supportStatus, setSupportStatus] = useState<PushSupportStatus>(readPushSupportStatus);

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

  const { mutateAsync: subscribeAsync } = subscribeMutation;
  const { mutateAsync: unsubscribeAsync } = unsubscribeMutation;
  const { mutateAsync: sendTestAsync, isPending: isTesting } = testMutation;

  const isSubscribed = Boolean(subscriptionQuery.data);

  const toggle = useCallback(async () => {
    if (isSubscribed) {
      await unsubscribeAsync();
      return;
    }

    await subscribeAsync();
  }, [isSubscribed, subscribeAsync, unsubscribeAsync]);

  return {
    supportStatus,
    isSubscribed,
    isLoading: subscriptionQuery.isLoading,
    isPending: subscribeMutation.isPending || unsubscribeMutation.isPending,
    isTesting,
    toggle,
    sendTest: sendTestAsync,
    refetch: subscriptionQuery.refetch
  };
}
