'use client';

import { Flex } from '@/components/ui/flex';
import { WebhookKpiCards } from '@/domains/webhooks-admin/sections/webhook-kpi-cards';
import { WebhooksTable } from '@/domains/webhooks-admin/sections/webhooks-table';

export function WebhooksAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Webhook events</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Read-only delivery log for Stripe and other inbound webhooks — idempotency and failure
          debugging.
        </p>
      </div>

      <WebhookKpiCards />

      <WebhooksTable />
    </Flex>
  );
}
