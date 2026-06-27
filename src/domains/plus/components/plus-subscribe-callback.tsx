'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { AUTH_USER_QUERY_KEY } from '@/components/providers/auth-provider';
import { getGetAccountSummaryQueryKey } from '@/services/-account-summary-get';
import { getGetPlusMembershipQueryKey } from '@/services/-plus-membership-get';

/** Handles Stripe return URLs on the Plus landing page. */
export function PlusSubscribeCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('plus.pricing');
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const status = searchParams.get('plus');
    if (!status) return;

    handled.current = true;

    if (status === 'success') {
      void queryClient.invalidateQueries({ queryKey: getGetPlusMembershipQueryKey() });
      void queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
      toast.success(t('success'));
    } else if (status === 'cancelled') {
      toast.message(t('stripeCancelled'));
    }

    router.replace('/plus/landing');
  }, [queryClient, router, searchParams, t]);

  return null;
}
