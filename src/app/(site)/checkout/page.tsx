import { Suspense } from 'react';

import CheckoutDomain from '@/domains/checkout/checkout.domain';
import { CheckoutLoading } from '@/domains/checkout/components/checkout-loading';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutDomain />
    </Suspense>
  );
}
