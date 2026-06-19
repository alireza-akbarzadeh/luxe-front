import type { UtilsResponse } from '@/services/-admin-webhooks-get.schemas';

export interface WebhookEvent {
  id?: number;
  event_id?: string;
  event_type?: string;
  source?: string;
  status?: string;
  error_msg?: string;
  created_at?: string;
  processed_at?: string;
}

export interface WebhookListData {
  events?: WebhookEvent[];
  total?: number;
  limit?: number;
  offset?: number;
}

export type GetAdminWebhooks200 = UtilsResponse & {
  data?: WebhookListData;
};

export const WEBHOOK_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Received', value: 'received' },
  { label: 'Processed', value: 'processed' },
  { label: 'Failed', value: 'failed' }
] as const;

export type WebhookStatusFilter = (typeof WEBHOOK_STATUS_TABS)[number]['value'];

export function getWebhooksFromListResponse(data: GetAdminWebhooks200 | undefined): WebhookEvent[] {
  return data?.data?.events ?? [];
}

export function getWebhooksTotalFromListResponse(data: GetAdminWebhooks200 | undefined): number {
  return data?.data?.total ?? 0;
}
