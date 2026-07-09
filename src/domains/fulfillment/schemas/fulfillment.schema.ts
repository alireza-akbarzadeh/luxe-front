export const FULFILLMENT_QUEUE_TABS = [
  { label: 'Pick', value: 'pick' },
  { label: 'Pack', value: 'pack' },
  { label: 'Ship', value: 'ship' },
  { label: 'Tracking', value: 'tracking' }
] as const;

export type FulfillmentQueue = (typeof FULFILLMENT_QUEUE_TABS)[number]['value'];

/** Order workflow states used as fulfillment queue filters. */
export const FULFILLMENT_ORDER_WORKFLOW_STATES = {
  pick: 'paid',
  pack: 'processing',
  ship: 'packed'
} as const satisfies Record<Exclude<FulfillmentQueue, 'tracking'>, string>;

export const FULFILLMENT_QUEUE_ACTIONS = {
  pick: { event: 'start_processing', label: 'Start picking', requiresTracking: false },
  pack: { event: 'pack', label: 'Mark packed', requiresTracking: false },
  ship: { event: 'ship', label: 'Ship order', requiresTracking: true }
} as const satisfies Record<
  Exclude<FulfillmentQueue, 'tracking'>,
  { event: string; label: string; requiresTracking: boolean }
>;
