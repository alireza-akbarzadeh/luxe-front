import { isRecord, readMessagePayload, readMessageType } from '@/lib/realtime/message-utils';

import type { RevenueSnapshot, SaleEvent, SaleEventType } from '../sales-store';

export type SalesFeedMessage =
  | { type: 'event'; payload: SaleEvent }
  | { type: 'revenue_snapshot'; payload: RevenueSnapshot }
  | { type: 'active_users'; payload: number }
  | { type: 'events_per_min'; payload: number };

const SALE_EVENT_TYPES = new Set<SaleEventType>([
  'new_order',
  'status_change',
  'cancellation',
  'shipment',
  'payment',
  'refund'
]);

function isSaleEvent(value: unknown): value is SaleEvent {
  if (!isRecord(value)) return false;
  return (
    typeof value['id'] === 'string' &&
    typeof value['type'] === 'string' &&
    SALE_EVENT_TYPES.has(value['type'] as SaleEventType) &&
    typeof value['title'] === 'string' &&
    typeof value['subtitle'] === 'string'
  );
}

function isRevenueSnapshot(value: unknown): value is RevenueSnapshot {
  if (!isRecord(value)) return false;
  return (
    typeof value['time'] === 'string' &&
    typeof value['revenue'] === 'number' &&
    typeof value['orders'] === 'number'
  );
}

/** Parses backend sales-feed WebSocket frames. */
export function parseSalesFeedMessage(value: unknown): SalesFeedMessage | null {
  const type = readMessageType(value);
  if (!type) return null;

  const payload = readMessagePayload(value);

  switch (type) {
    case 'event':
      return isSaleEvent(payload) ? { type, payload } : null;
    case 'revenue_snapshot':
      return isRevenueSnapshot(payload) ? { type, payload } : null;
    case 'active_users':
      return typeof payload === 'number' ? { type, payload } : null;
    case 'events_per_min':
      return typeof payload === 'number' ? { type, payload } : null;
    default:
      return null;
  }
}

/** Applies a parsed sales-feed frame to store actions. */
export function handleSalesFeedMessage(
  message: SalesFeedMessage,
  actions: {
    ingestEvent: (event: SaleEvent) => void;
    ingestRevenueSnapshot: (snapshot: RevenueSnapshot) => void;
    setActiveUsers: (count: number) => void;
    setEventsPerMin: (count: number) => void;
  }
) {
  switch (message.type) {
    case 'event':
      actions.ingestEvent({
        ...message.payload,
        timestamp: message.payload.timestamp ?? Date.now()
      });
      break;
    case 'revenue_snapshot':
      actions.ingestRevenueSnapshot(message.payload);
      break;
    case 'active_users':
      actions.setActiveUsers(message.payload);
      break;
    case 'events_per_min':
      actions.setEventsPerMin(message.payload);
      break;
  }
}
