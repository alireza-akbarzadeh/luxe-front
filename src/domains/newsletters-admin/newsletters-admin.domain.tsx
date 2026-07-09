'use client';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { SubscribersAdminDomain } from '@/domains/newsletters-admin/subscribers.admin.domain';

export function NewslettersAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' spacing={1}>
        <Typography.H2>Subscribers</Typography.H2>
        <Typography.Muted>
          Marketing opt-ins synced from storefront signups and checkout.
        </Typography.Muted>
      </Flex>
      <SubscribersAdminDomain />
    </Flex>
  );
}
