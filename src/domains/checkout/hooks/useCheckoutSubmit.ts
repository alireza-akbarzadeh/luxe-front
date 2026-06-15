// app/checkout/hooks/useCheckoutSubmit.ts
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';

import { useCartController } from '@/hooks/useCartController';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { ShippingProviders } from '@/lib/constants/enum-statuses';
import { usePostCheckout } from '@/services/-checkout-post';
import type { PostCheckout201 } from '@/services/-checkout-post.schemas';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';

import type { CheckoutFormValues } from '../checkout.schema';
import { paymentMethodRequiresCard, resolveCheckoutOrderId } from '../lib/checkout-utils';
import { useCheckoutStore } from '../store/checkout.store';

export function useCheckoutSubmit() {
  const router = useRouter();
  const { clearCart } = useCartController();
  const setSubmitError = useCheckoutStore((s) => s.setSubmitError);
  const setIsRedirecting = useCheckoutStore((s) => s.setIsRedirecting);
  const { data: providersResponse } = useGetShippingProviders();
  const providers = providersResponse?.data ?? [];
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
          phone: values.phone || '',
          shipping_provider_id: Number(values.shippingProviderId),
          payment_method: values.paymentMethod,
          save_info: values.saveInfo,
          newsletter: values.newsletter,
          coupon_code: values.couponCode || undefined,
          shipping_method: selectedProvider?.name || ShippingProviders.Standard,
          card_number: requiresCard ? cardDigits : '',
          expiry_month: requiresCard ? Number(values.expiryMonth) : 0,
          expiry_year: requiresCard ? Number(values.expiryYear) : 0,
          cvv: requiresCard ? (values.cvv ?? '') : '',
          card_last4: requiresCard ? cardDigits.slice(-4) : ''
        }
      });

      if (response?.success === false) {
        const message = response.message || 'Failed to place order';
        setSubmitError(message);
        toast.error(message);
        throw new Error(message);
      }

      const orderId = resolveCheckoutOrderId(response);
      if (!orderId) {
        const message = 'Order was created but no order ID was returned.';
        setSubmitError(message);
        toast.error(message);
        throw new Error(message);
      }

      // Block empty-cart UI while client navigates — never call reset() here (it clears this flag).
      setIsRedirecting(true);
      toast.success('Order placed successfully!');

      router.replace(`/order-tracking/${orderId}?confirmed=1`);

      void clearCart().catch(() => {
        // Cart is already cleared server-side during checkout.
      });
    } catch (error) {
      setIsRedirecting(false);
      submitLockRef.current = false;

      const isAxiosError = error instanceof Error && 'isAxiosError' in error;
      const message = isAxiosError
        ? extractErrorMessage(error as AxiosError<ApiErrorResponse>)
        : error instanceof Error
          ? error.message
          : 'Failed to place order. Please try again.';
      setSubmitError(message);
      if (!isAxiosError) {
        toast.error(message);
      }
      throw error;
    }
  };

  return { submitOrder, isPending };
}
