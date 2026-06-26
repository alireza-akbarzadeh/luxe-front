/** WebSocket event types for vendor panel live updates. */
export const VENDOR_WS_EVENTS = {
  ORDER_NEW: 'vendor_order_new',
  ORDER_UPDATE: 'vendor_order_update',
  ORDER_SHIPMENT: 'vendor_order_shipment',
  MESSAGE: 'vendor_message',
  NOTIFICATION: 'notification',
  CHAT_MESSAGE: 'chat_message'
} as const;

export type VendorWsEvent = (typeof VENDOR_WS_EVENTS)[keyof typeof VENDOR_WS_EVENTS];

/** Room for store-scoped order and shipment events. */
export function storeRoomId(storeId: number) {
  return `store_${storeId}`;
}

/** Room for vendor-wide messages and alerts. */
export function vendorUserRoomId(userId: number) {
  return `vendor_${userId}`;
}

export function isVendorOrderEvent(type: string | undefined) {
  return (
    type === VENDOR_WS_EVENTS.ORDER_NEW ||
    type === VENDOR_WS_EVENTS.ORDER_UPDATE ||
    type === VENDOR_WS_EVENTS.ORDER_SHIPMENT
  );
}

export function isVendorMessageEvent(type: string | undefined) {
  return type === VENDOR_WS_EVENTS.MESSAGE || type === VENDOR_WS_EVENTS.CHAT_MESSAGE;
}
