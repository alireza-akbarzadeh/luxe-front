import { Suspense } from 'react';

import { VendorLoginDomain } from '@/domains/vendor/auth/vendor-login.domain';

export default function VendorLoginPage() {
  return (
    <Suspense fallback={null}>
      <VendorLoginDomain />
    </Suspense>
  );
}
