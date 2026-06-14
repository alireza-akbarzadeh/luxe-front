// app/checkout/hooks/useCheckoutSubmit.ts
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useCartController } from '@/hooks/useCartController';
import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { ShippingProviders } from '@/lib/constants/enum-statuses';
import { usePostCheckout } from '@/services/-checkout-post';
import { useGetShippingProviders } from '@/services/-shipping-providers-get';

import type { CheckoutFormValues } from '../checkout.schema';
import { paymentMethodRequiresCard } from '../lib/checkout-utils';
import { useCheckoutStore } from '../store/checkout.store';

export function useCheckoutSubmit() {
  const router = useRouter();
  const { clearCart } = useCartController();
  const resetCheckout = useCheckoutStore((s) => s.reset);
  const setSubmitError = useCheckoutStore((s) => s.setSubmitError);
  const { data: providersResponse } = useGetShippingProviders();
  const providers = providersResponse?.data ?? [];

  const { mutateAsync, isPending } = usePostCheckout();

  const submitOrder = async (values: CheckoutFormValues): Promise<void> => {
    setSubmitError(null);

    const selectedProvider = providers.find(
      (provider) => provider.id === values.shippingProviderId
    );
    const requiresCard = paymentMethodRequiresCard(values.paymentMethod);
    const cardDigits = (values.cardNumber ?? '').replace(/\D/g, '');

    try {
      const response = await mutateAsync({
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

      const orderId = response?.data?.id;
      if (!orderId) {
        const message = 'Order was created but no order ID was returned.';
        setSubmitError(message);
        toast.error(message);
        throw new Error(message);
      }

      await clearCart();
      resetCheckout();
      router.push(`/order-confirmed/${orderId}`);
    } catch (error) {
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
