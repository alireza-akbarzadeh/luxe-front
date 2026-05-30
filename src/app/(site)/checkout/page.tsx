import { Suspense } from 'react';

import { CheckoutLoading } from '@/domains/checkout/components/checkout-loading';
import CheckoutDomain from '@/domains/checkout/checkout.domain';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutDomain />
    </Suspense>
  );
}
