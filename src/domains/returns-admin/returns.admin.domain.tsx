'use client';

import { Flex } from '@/components/ui/flex';
import { ReturnsKPICards } from '@/domains/returns-admin/sections/returns-kpi-cards';
import { ReturnsTable } from '@/domains/returns-admin/sections/returns-table';

export function ReturnsAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Returns</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Review return requests, receive items, process refunds, and restock inventory.
        </p>
      </div>

      <ReturnsKPICards />

      <ReturnsTable />
    </Flex>
  );
}
