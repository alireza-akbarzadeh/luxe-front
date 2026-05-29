import { Suspense } from 'react';

import CheckoutDomain from '@/domains/checkout/checkout.domain';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutDomain />
    </Suspense>
  );
}
