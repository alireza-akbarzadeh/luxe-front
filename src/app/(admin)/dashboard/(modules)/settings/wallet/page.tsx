import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { WalletAdminDomain } from '@/domains/wallet-admin/wallet-admin.domain';

function WalletAdjustLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-56' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </div>
      <Skeleton className='h-96 max-w-2xl rounded-xl' />
    </div>
  );
}

export default function WalletSettingsPage() {
  return (
    <Suspense fallback={<WalletAdjustLoading />}>
      <WalletAdminDomain />
    </Suspense>
  );
}
