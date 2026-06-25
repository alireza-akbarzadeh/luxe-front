'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { ShipmentsKPICards } from '@/domains/shipments-admin/sections/shipments-kpi-cards';
import { ShipmentsTable } from '@/domains/shipments-admin/sections/shipments-table';

export function ShipmentsAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Shipments</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Track fulfillment, monitor carrier status, and advance shipments through delivery
            workflow.
          </p>
        </div>
        <Button variant='outline' size='sm' asChild>
          <Link href='/dashboard/shipping-providers'>Manage carriers</Link>
        </Button>
      </div>

      <ShipmentsKPICards />

      <ShipmentsTable />
    </Flex>
  );
}
