'use client';

import { Flex } from '@/components/ui/flex';
import { InvoicesKPICards } from '@/domains/invoices-admin/sections/invoices-kpi-cards';
import { InvoicesTable } from '@/domains/invoices-admin/sections/invoices-table';

export function InvoicesAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Invoices</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Review billing records, track payment status, and manage invoice lifecycle.
        </p>
      </div>

      <InvoicesKPICards />

      <InvoicesTable />
    </Flex>
  );
}
