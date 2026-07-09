import type { FulfillmentQueue } from '@/domains/fulfillment/schemas/fulfillment.schema';
import type { DtoAdminOrderListItem } from '@/services/-orders-get.schemas';

export interface FulfillmentShipDialogState {
  order: DtoAdminOrderListItem;
  queue: Exclude<FulfillmentQueue, 'tracking'>;
}
