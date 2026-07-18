'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { useAuth } from '@/components/providers/auth-provider';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { usePostGiftCards } from '@/services/-gift-cards-post';

import { GIFT_CARD_AMOUNTS, giftCardPurchaseSchema } from '../gift-cards.schema';
import { formatGiftCardDeliveryDate, redirectToGiftCardCheckout } from '../lib/gift-card-checkout';

function firstFieldErrorMessage(formApi: {
  state: { fieldMeta: Record<string, { errors?: unknown[] }>; errorMap: unknown };
}): string | undefined {
  for (const meta of Object.values(formApi.state.fieldMeta)) {
    const first = meta?.errors?.[0];
    if (typeof first === 'string' && first.trim()) return first;
    if (first && typeof first === 'object' && 'message' in first) {
      const message = (first as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) return message;
    }
  }
  const errorMap = formApi.state.errorMap;
  if (errorMap && typeof errorMap === 'object') {
    for (const value of Object.values(errorMap as Record<string, unknown>)) {
      if (typeof value === 'string' && value.trim()) return value;
    }
  }
  return undefined;
}

/** Purchase form state + Stripe redirect for public gift card checkout. */
export function useGiftCardPurchase(redirectPath = '/gift-cards') {
  const t = useTranslations('giftCardsPage.purchase');
  const { openAuthDialog } = useRequireAuth();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { mutateAsync: createGiftCard, isPending: isCreating } = usePostGiftCards();

  const form = useAppForm({
    defaultValues: {
      amount: 100,
      recipientEmail: '',
      recipientName: '',
      senderName: '',
      message: '',
      deliveryDate: ''
    },
    // Pass Zod schema directly so field-level errors surface under inputs
    validators: { onSubmit: giftCardPurchaseSchema },
    onSubmitInvalid: ({ formApi }) => {
      toast.error(firstFieldErrorMessage(formApi) ?? t('validationError'));
    },
    onSubmit: async ({ value }) => {
      if (!isAuthenticated) {
        openAuthDialog({ callbackUrl: redirectPath, reason: 'gift-card' });
        return;
      }

      try {
        const result = await createGiftCard({
          data: {
            amount: Math.trunc(value.amount),
            recipient_email: value.recipientEmail,
            recipient_name: value.recipientName,
            sender_name: value.senderName,
            message: value.message || undefined,
            delivery_date: formatGiftCardDeliveryDate(value.deliveryDate)
          }
        });

        if (redirectToGiftCardCheckout(result.data)) {
          return;
        }

        toast.error(t('paymentRequired'));
      } catch (error) {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t('error')
        );
      }
    }
  });

  const selectAmount = (amount: number) => {
    form.setFieldValue('amount', amount);
  };

  return {
    form,
    amounts: GIFT_CARD_AMOUNTS,
    selectAmount,
    isCreating,
    isAuthenticated,
    isAuthLoading
  };
}
