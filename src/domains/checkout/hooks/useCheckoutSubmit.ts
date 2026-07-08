// app/checkout/hooks/useCheckoutSubmit.ts
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { toast } from 'sonner';

import { useCartController } from '@/hooks/useCartController';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { ShippingProviders } from '@/lib/constants/enum-statuses';
import { formatPhoneE164ForApi } from '@/lib/phone-utils';
import { getGetCartQueryKey } from '@/services/-cart-get';
import { usePostCheckout } from '@/services/-checkout-post';
import type { PostCheckout201 } from '@/services/-checkout-post.schemas';
import type { DtoCheckoutRequestPaymentMethod } from '@/services/-checkout-post.schemas';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';

import {
  paymentMethodRequiresCard,
  resolveCheckoutOrderId,
  resolveCheckoutStripeRedirect
} from '../lib/checkout-utils';
import { persistStripeCheckoutSession } from '../lib/stripe-checkout-session-storage';
import { useCheckoutStore } from '../store/checkout.store';
import type { CheckoutFormValues } from '../types/checkout.types';
import { useStripeCheckoutEnabled } from './useStripeCheckoutEnabled';

/** Maps storefront payment UI values to API payment_method enum. */
function mapCheckoutPaymentMethod(
  method: CheckoutFormValues['paymentMethod'],
  isStripeCheckout: boolean
): DtoCheckoutRequestPaymentMethod {
  if (
    isStripeCheckout &&
    (method === 'credit_card' || method === 'debit_card' || method === 'paypal')
  ) {
    return 'stripe';
  }
  if (method === 'gift_card' || method === 'store_credit') {
    return 'wallet';
  }
  return 'mock';
}

export function useCheckoutSubmit() {
  const t = useTranslations('checkout.submit');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCart, items: cartItems } = useCartController();
  const setSubmitError = useCheckoutStore((s) => s.setSubmitError);
  const setIsRedirecting = useCheckoutStore((s) => s.setIsRedirecting);
  const setRedirectMode = useCheckoutStore((s) => s.setRedirectMode);
  const { data: providersResponse } = useGetShippingProviders();
  const providers = providersResponse?.data ?? [];
  const { isStripeCheckout } = useStripeCheckoutEnabled();
  const submitLockRef = useRef(false);

  const { mutateAsync, isPending } = usePostCheckout();

  const submitOrder = async (values: CheckoutFormValues): Promise<void> => {
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setSubmitError(null);

    const selectedProvider = providers.find(
      (provider) => provider.id === values.shippingProviderId
    );
    const requiresCard = paymentMethodRequiresCard(values.paymentMethod);
    const cardDigits = (values.cardNumber ?? '').replace(/\D/g, '');

    try {
      if (cartItems.length === 0) {
        const message = t('cartEmpty');
        void queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setSubmitError(message);
        toast.error(message);
        throw new Error(message);
      }

      const paymentMethod = mapCheckoutPaymentMethod(values.paymentMethod, isStripeCheckout);

      setRedirectMode(paymentMethod === 'stripe' ? 'payment' : 'confirmed');
      setIsRedirecting(true);

      const response: PostCheckout201 = await mutateAsync({
        data: {
          email: values.email || '',
          first_name: values.firstName || '',
          last_name: values.lastName || '',
          address_line1: values.addressLine1,
          address_line2: values.addressLine2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
          phone: formatPhoneE164ForApi(values.phone) ?? '',
          shipping_provider_id: Number(values.shippingProviderId),
          payment_method: paymentMethod,
          save_info: values.saveInfo,
          newsletter: values.newsletter,
          coupon_code: values.couponCode || undefined,
          shipping_method: selectedProvider?.name || ShippingProviders.Standard,
          ...(paymentMethod === 'mock' && requiresCard
            ? {
                card_number: cardDigits,
                expiry_month: Number(values.expiryMonth),
                expiry_year: Number(values.expiryYear),
                cvv: values.cvv ?? '',
                card_last4: cardDigits.slice(-4)
              }
            : {})
        }
      });

      if (response?.success === false) {
        let message = response.message || t('failed');
        if (/cart is empty/i.test(message)) {
          message = t('cartEmpty');
        }
        void queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setSubmitError(message);
        toast.error(message);
        throw new Error(message);
      }

      const stripeRedirect = resolveCheckoutStripeRedirect(response);
      const orderId = resolveCheckoutOrderId(response);

      if (stripeRedirect) {
        if (stripeRedirect.stripeSessionId) {
          persistStripeCheckoutSession(stripeRedirect.orderId, stripeRedirect.stripeSessionId);
        }
        queryClient.removeQueries({ queryKey: getGetCartQueryKey() });
        window.location.assign(stripeRedirect.checkoutUrl);
        return;
      }

      if (isStripeCheckout) {
        const message = orderId ? t('stripeMissingCheckoutUrl') : t('invalidResponse');
        setSubmitError(message);
        toast.error(message);
        throw new Error(message);
      }

      if (!orderId) {
        const message = t('invalidResponse');
        setSubmitError(message);
        toast.error(message);
        throw new Error(message);
      }

      setRedirectMode('confirmed');
      toast.success(t('success'));

      router.replace(`/order-confirmed/${orderId}?confirmed=1`);

      void clearCart().catch(() => {
        // Cart is already cleared server-side during checkout.
      });
    } catch (error) {
      setIsRedirecting(false);
      setRedirectMode(null);
      submitLockRef.current = false;

      void queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });

      const isAxiosError = error instanceof Error && 'isAxiosError' in error;
      let message = isAxiosError
        ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
        : error instanceof Error
          ? error.message
          : t('failed');

      if (/cart is empty/i.test(message)) {
        message = t('cartEmpty');
      }

      setSubmitError(message);
      if (!isAxiosError) {
        toast.error(message);
      }
      throw error;
    }
  };

  return { submitOrder, isPending };
}
