'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { postWalletDepositConfirmStripe } from '@/domains/account/lib/confirm-wallet-deposit-stripe';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { getGetWalletQueryKey } from '@/services/-wallet-get';

function getStripeSessionId(searchParams: URLSearchParams) {
  return searchParams.get('session_id')?.trim() ?? '';
}

/** Confirms Stripe wallet deposit on return and stays on the payment tab. */
export function WalletStripeReturnHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations('account.wallet');
  const handledSessionRef = useRef<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const status = searchParams.get('deposit');
    const sessionId = getStripeSessionId(searchParams);

    if (status === 'cancelled') {
      toast.message(t('stripeDepositCancelled'));
      router.replace('/account?tab=payment');
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
        const result = await postWalletDepositConfirmStripe(sessionId);

        await queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });

        toast.success(result.message ?? t('depositConfirmed'));
        router.replace('/account?tab=payment');
      } catch (error: unknown) {
        const message =
          error instanceof AxiosError
            ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
            : t('depositConfirmError');
        toast.error(message || t('depositConfirmError'));
        router.replace('/account?tab=payment');
      } finally {
        setIsConfirming(false);
      }
    };

    void confirm();
  }, [queryClient, router, searchParams, t]);

  if (!isConfirming) {
    return null;
  }

  return (
    <Box className='border-gold/30 bg-gold/10 mb-6 rounded-2xl border p-4'>
      <Flex align='center' gap={3}>
        <IconLoader2 className='text-gold-strong size-5 animate-spin' aria-hidden />
        <Text className='text-sm font-medium'>{t('depositConfirming')}</Text>
      </Flex>
    </Box>
  );
}
