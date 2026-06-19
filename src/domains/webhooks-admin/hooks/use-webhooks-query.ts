import { parseAsStringEnum, useQueryState } from 'nuqs';

import {
  WEBHOOK_STATUS_TABS,
  type WebhookStatusFilter
} from '@/domains/webhooks-admin/lib/webhook-list';

const STATUS_VALUES = WEBHOOK_STATUS_TABS.map((tab) => tab.value);

export function useWebhooksQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<WebhookStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );

  return { status, setStatus };
}
