'use client';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { VendorsKpiCards } from '@/domains/vendors-admin/components/vendors-kpi-cards';
import { VendorsTable } from '@/domains/vendors-admin/sections/vendors-table';

export function VendorsAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' className='gap-1'>
        <Typography.H2 as='h1'>Vendors</Typography.H2>
        <Typography.Muted className='max-w-2xl'>
          Single hub for marketplace sellers — create profiles, run approvals, and review
          performance.
        </Typography.Muted>
      </Flex>

      <VendorsKpiCards />
      <VendorsTable />
    </Flex>
  );
}
