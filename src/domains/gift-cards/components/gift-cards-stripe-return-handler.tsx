'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';

import { postGiftCardsConfirmStripe } from '../lib/confirm-gift-card-stripe';

function getStripeSessionId(searchParams: URLSearchParams) {
  return searchParams.get('session_id')?.trim() ?? '';
}

/** Confirms Stripe gift card payment on return from checkout. */
export function GiftCardsStripeReturnHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('giftCardsPage.stripe');
  const handledSessionRef = useRef<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const status = searchParams.get('purchase');
    const sessionId = getStripeSessionId(searchParams);

    if (status === 'cancelled') {
      toast.message(t('cancelled'));
      router.replace('/gift-cards');
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
        const result = await postGiftCardsConfirmStripe(sessionId);
        toast.success(result.message ?? t('success'));
        router.replace('/account?tab=giftCards');
      } catch (error: unknown) {
        const message =
          error instanceof AxiosError
            ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
            : t('confirmError');
        toast.error(message || t('confirmError'));
        router.replace('/gift-cards');
      } finally {
        setIsConfirming(false);
      }
    };

    void confirm();
  }, [router, searchParams, t]);

  if (!isConfirming) {
    return null;
  }

  return (
    <Box className='border-gold/30 bg-gold/10 mb-8 rounded-2xl border p-4'>
      <Flex align='center' gap={3}>
        <IconLoader2 className='text-gold-strong size-5 animate-spin' aria-hidden />
        <Text className='text-sm font-medium'>{t('confirming')}</Text>
      </Flex>
    </Box>
  );
}
