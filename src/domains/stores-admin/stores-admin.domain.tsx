'use client';

import { Flex } from '@/components/ui/flex';
import { StoresTable } from '@/domains/stores-admin/sections/stores-table';

export function StoresAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Stores</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Manage marketplace vendors, storefront profiles, and category associations.
        </p>
      </div>

      <StoresTable />
    </Flex>
  );
}
