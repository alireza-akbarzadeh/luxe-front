import { useGetPaymentsStripeConfig } from '@/services/-payments-stripe-config-get';

/** True when checkout should use Stripe Checkout redirect instead of on-page card fields. */
export function useStripeCheckoutEnabled() {
  const { data, isLoading } = useGetPaymentsStripeConfig();
  return {
    isStripeCheckout: data?.data?.enabled === true,
    isLoading
  };
}
