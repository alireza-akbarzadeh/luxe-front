'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { CustomersKPICards } from '@/domains/customers-admin/sections/customers-kpi-cards';
import { CustomersTable } from '@/domains/customers-admin/sections/customers-table';

export function CustomersAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex align='start' justify='between' wrap='wrap' className='gap-4'>
        <Flex direction='column' className='gap-1'>
          <Text variant='h3' as='h1'>
            Customers
          </Text>
          <Text variant='muted' as='p'>
            CRM profiles, purchase history, loyalty tiers, segments, and internal notes.
          </Text>
        </Flex>
        <Button variant='outline' size='sm' asChild>
          <Link href='/dashboard/users'>User accounts</Link>
        </Button>
      </Flex>

      <CustomersKPICards />
      <CustomersTable />
    </Flex>
  );
}
