// app/checkout/hooks/useCheckoutSubmit.ts
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useCartController } from '@/hooks/useCartController';
import { ShippingProviders } from '@/lib/constants/enum-statuses';
import { usePostCheckout } from '@/services/-checkout-post';
import { getGetShippingProvidersQueryKey } from '@/services/-shipping-providers-get';
import type { ModelsShippingProviders } from '@/services/-shipping-providers-get.schemas';

import type { CheckoutFormValues } from '../checkout.schema';

export function useCheckoutSubmit() {
  const router = useRouter();
  const { clearCart } = useCartController();
  const queryClient = useQueryClient();
  const providers = queryClient.getQueryData<ModelsShippingProviders[]>(
    getGetShippingProvidersQueryKey()
  );
  const { mutate, isPending } = usePostCheckout({
    mutation: {
      onSuccess: async (response) => {
        if (response?.success === false) {
          toast.error(response.message || 'Failed to place order');
          return;
        }

        await clearCart();
        const orderId = response?.data?.id;
        toast.success('Order placed successfully!');
        router.push(`/order-tracking/${orderId}`);
      },
      onError: (error) => {
        console.error('Checkout error:', error);
        toast.error('Failed to place order. Please try again.');
      }
    }
  });

  const submitOrder = (values: CheckoutFormValues) => {
    const selectedProvider = providers?.find(
      (provider) => provider.id === values.shippingProviderId
    );

    mutate({
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
        card_number: values.cardNumber.replace(/\s/g, ''),
        expiry_month: Number(values.expiryMonth),
        expiry_year: Number(values.expiryYear),
        cvv: values.cvv,
        card_last4: values.cardNumber.slice(-4)
      }
    });
  };

  return { submitOrder, isPending };
}
