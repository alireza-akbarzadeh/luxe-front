import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { FulfillmentQueue } from '@/domains/fulfillment/schemas/fulfillment.schema';
import { FULFILLMENT_QUEUE_TABS } from '@/domains/fulfillment/schemas/fulfillment.schema';

const QUEUE_VALUES = FULFILLMENT_QUEUE_TABS.map((tab) => tab.value);

export function useFulfillmentQueryState() {
  const [queue, setQueue] = useQueryState(
    'queue',
    parseAsStringEnum<FulfillmentQueue>([...QUEUE_VALUES]).withDefault('pick')
  );

  return { queue, setQueue };
}
