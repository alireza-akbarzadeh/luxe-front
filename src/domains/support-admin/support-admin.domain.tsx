'use client';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { SupportKPICards } from '@/domains/support-admin/sections/support-kpi-cards';
import { SupportTable } from '@/domains/support-admin/sections/support-table';

export function SupportAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' className='gap-1'>
        <Text variant='h3' as='h1'>
          Customer support
        </Text>
        <Text variant='muted' as='p'>
          Tickets, live chat, email threads, AI suggested replies, and internal notes.
        </Text>
      </Flex>

      <SupportKPICards />
      <SupportTable />
    </Flex>
  );
}
