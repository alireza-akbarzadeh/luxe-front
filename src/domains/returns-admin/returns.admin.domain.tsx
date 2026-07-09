'use client';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { ReturnsAnalytics } from '@/domains/returns-admin/sections/returns-analytics';
import { ReturnsKPICards } from '@/domains/returns-admin/sections/returns-kpi-cards';
import { ReturnsTable } from '@/domains/returns-admin/sections/returns-table';

export function ReturnsAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' className='gap-1'>
        <Text variant='h3' as='h1'>
          Returns
        </Text>
        <Text variant='muted' as='p'>
          Review return and exchange requests, run approval and refund workflows, and track
          analytics.
        </Text>
      </Flex>

      <ReturnsKPICards />
      <ReturnsAnalytics />
      <ReturnsTable />
    </Flex>
  );
}
