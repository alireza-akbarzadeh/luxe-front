'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { FulfillmentKPICards } from '@/domains/fulfillment/sections/fulfillment-kpi-cards';
import { FulfillmentQueueTable } from '@/domains/fulfillment/sections/fulfillment-queue-table';

export function FulfillmentDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex align='start' justify='between' wrap='wrap' className='gap-4'>
        <Flex direction='column' className='gap-1'>
          <Text variant='h3' as='h1'>
            Fulfillment center
          </Text>
          <Text variant='muted' as='p'>
            Pick, pack, and ship paid orders — track in-transit shipments and manage carriers.
          </Text>
        </Flex>
        <Flex direction='row' wrap='wrap' className='gap-2'>
          <Button variant='outline' size='sm' asChild>
            <Link href='/dashboard/shipments'>All shipments</Link>
          </Button>
          <Button variant='outline' size='sm' asChild>
            <Link href='/dashboard/shipping-providers'>Carriers</Link>
          </Button>
        </Flex>
      </Flex>

      <FulfillmentKPICards />
      <FulfillmentQueueTable />
    </Flex>
  );
}
