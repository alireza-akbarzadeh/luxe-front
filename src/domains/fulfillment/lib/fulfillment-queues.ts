import {
  FULFILLMENT_ORDER_WORKFLOW_STATES,
  FULFILLMENT_QUEUE_ACTIONS,
  type FulfillmentQueue
} from '@/domains/fulfillment/schemas/fulfillment.schema';

export function isOrderFulfillmentQueue(
  queue: FulfillmentQueue
): queue is Exclude<FulfillmentQueue, 'tracking'> {
  return queue !== 'tracking';
}

export function getOrderWorkflowStateForQueue(queue: Exclude<FulfillmentQueue, 'tracking'>) {
  return FULFILLMENT_ORDER_WORKFLOW_STATES[queue];
}

export function getQueueAction(queue: Exclude<FulfillmentQueue, 'tracking'>) {
  return FULFILLMENT_QUEUE_ACTIONS[queue];
}
