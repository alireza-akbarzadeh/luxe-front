'use client';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { VendorApplicationsTable } from '@/domains/vendor-applications-admin/sections/applications-table';

export function VendorApplicationsAdminDomain() {
  return (
    <Flex direction='column' spacing={6} fullWidth>
      <div>
        <Typography.H1 className='text-2xl font-semibold tracking-tight'>
          Vendor applications
        </Typography.H1>
        <Typography.Muted className='mt-1 text-sm'>
          Review pending seller onboarding requests and approve or reject storefronts.
        </Typography.Muted>
      </div>

      <VendorApplicationsTable />
    </Flex>
  );
}
