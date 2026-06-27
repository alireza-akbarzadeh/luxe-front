'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { AUTH_USER_QUERY_KEY } from '@/components/providers/auth-provider';
import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { postPlusSubscribeConfirmStripe } from '@/domains/plus/lib/confirm-plus-stripe';
import { usePlusActivationStore } from '@/domains/plus/stores/plus-activation-store';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { getGetAccountSummaryQueryKey } from '@/services/-account-summary-get';
import { getGetPlusMembershipQueryKey } from '@/services/-plus-membership-get';

function getStripeSessionId(searchParams: URLSearchParams) {
  return searchParams.get('session_id')?.trim() ?? '';
}

/** Confirms Stripe Plus payment on return and lands on account overview. */
export function PlusStripeReturnHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('plus.account');
  const setReceipt = usePlusActivationStore((state) => state.setReceipt);
  const handledSessionRef = useRef<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const status = searchParams.get('plus');
    const sessionId = getStripeSessionId(searchParams);

    if (status === 'cancelled') {
      toast.message(t('stripeCancelled'));
      router.replace('/account?tab=overview');
      return;
    }

    if (status !== 'success' || !sessionId) {
      return;
    }

    if (handledSessionRef.current === sessionId) {
      return;
    }

    handledSessionRef.current = sessionId;
    setIsConfirming(true);

    const confirm = async () => {
      try {
        const result = await postPlusSubscribeConfirmStripe(sessionId);
        const receipt = result.data?.receipt ?? null;

        if (receipt) {
          setReceipt(receipt);
        }

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getGetPlusMembershipQueryKey() }),
          queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() })
        ]);

        toast.success(result.message ?? t('activationSuccess'));
        router.replace('/account?tab=overview');
      } catch (error: unknown) {
        const message =
          error instanceof AxiosError
            ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
            : t('activationError');
        toast.error(message || t('activationError'));
        router.replace('/account?tab=overview');
      } finally {
        setIsConfirming(false);
      }
    };

    void confirm();
  }, [queryClient, router, searchParams, setReceipt, t]);

  if (!isConfirming) {
    return null;
  }

  return (
    <Box className='border-gold/30 bg-gold/10 mb-6 rounded-2xl border p-4'>
      <Flex align='center' gap={3}>
        <IconLoader2 className='text-gold-strong size-5 animate-spin' aria-hidden />
        <Text className='text-sm font-medium'>{t('activating')}</Text>
      </Flex>
    </Box>
  );
}
