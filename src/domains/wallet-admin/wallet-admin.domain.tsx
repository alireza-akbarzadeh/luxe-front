'use client';

import { Flex } from '@/components/ui/flex';
import { WalletAdjustForm } from '@/domains/wallet-admin/sections/wallet-adjust-form';

export function WalletAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Wallet adjustments</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Support tool for manual wallet credits and debits — recorded as adjustment transactions.
        </p>
      </div>

      <WalletAdjustForm />
    </Flex>
  );
}
