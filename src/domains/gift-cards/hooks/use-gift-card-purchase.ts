'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { useAuth } from '@/components/providers/auth-provider';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import { usePostGiftCards } from '@/services/-gift-cards-post';

import { GIFT_CARD_AMOUNTS, giftCardPurchaseSchema } from '../gift-cards.schema';
import { formatGiftCardDeliveryDate, redirectToGiftCardCheckout } from '../lib/gift-card-checkout';

/** Purchase form state + Stripe redirect for public gift card checkout. */
export function useGiftCardPurchase(redirectPath = '/gift-cards') {
  const t = useTranslations('giftCardsPage.purchase');
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { mutateAsync: createGiftCard, isPending: isCreating } = usePostGiftCards();
  const [selectedAmount, setSelectedAmount] = useState<number>(100);

  const form = useAppForm({
    defaultValues: {
      amount: 100,
      recipientEmail: '',
      recipientName: '',
      senderName: '',
      message: '',
      deliveryDate: ''
    },
    validators: zodFormValidators(giftCardPurchaseSchema),
    onSubmit: async ({ value }) => {
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
        return;
      }

      try {
        const result = await createGiftCard({
          data: {
            amount: value.amount,
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
    setSelectedAmount(amount);
    form.setFieldValue('amount', amount);
  };

  return {
    form,
    amounts: GIFT_CARD_AMOUNTS,
    selectedAmount,
    selectAmount,
    isCreating,
    isAuthenticated,
    isAuthLoading
  };
}
