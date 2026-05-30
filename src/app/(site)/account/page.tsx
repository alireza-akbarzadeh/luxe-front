import { Suspense } from 'react';

import { AccountDomain } from '@/domains/account/account.domain';
import { AccountPageSkeleton } from '@/domains/account/components/account-page-skeleton';

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountDomain />
    </Suspense>
  );
}
