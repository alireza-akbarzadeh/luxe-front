import { Suspense } from 'react';

import { AccountDomain } from '@/domains/account/account.domain';

export default function AccountPage() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <AccountDomain />
    </Suspense>
  );
}
