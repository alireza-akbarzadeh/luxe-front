// app/checkout/hooks/useCheckoutSubmit.ts
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { useCart } from '~/src/hooks/useCartController';
import { usePostOrders } from '~/src/services/-orders-post';
import type { CheckoutFormValues } from '../checkout.schema';

export function useCheckoutSubmit() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { mutateAsync, isPending } = usePostOrders();

  const submitOrder = async (value: CheckoutFormValues) => {
    try {
      await mutateAsync({
        data: {
          email: value.email,
          first_name: value.firstName,
          last_name: value.lastName,
          address_line1: value.addressLine1,
          address_line2: value.addressLine2,
          city: value.city,
          state: value.state,
          zip: value.zip,
          country: value.country,
          phone: value.phone,
          shipping_method: value.shippingMethod,
          payment_method: 'card',
          save_info: value.saveInfo,
          newsletter: value.newsletter,
          card_last4: value.cardNumber.slice(-4),
          coupon_code: value.couponCode || undefined
        }
      });

      await clearCart();
      toast.success('Order placed successfully!');
      router.push('/order-confirmation');
    } catch {
      toast.error('Failed to place order');
    }
  };

  return { submitOrder, isPending };
}
