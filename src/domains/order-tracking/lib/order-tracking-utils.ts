import { OrderStatus } from '@/lib/constants/enum-statuses';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';
import type { ModelsOrder, ModelsShipment } from '~/src/services/-orders-my-get.schemas';

export type OrderProgressStepStatus = 'completed' | 'active' | 'upcoming' | 'cancelled';

export interface OrderProgressStep {
  key: string;
  title: string;
  description: string;
  status: OrderProgressStepStatus;
}

export interface OrderProgressState {
  steps: OrderProgressStep[];
  progressPercent: number;
  isTerminal: boolean;
  terminalType?: 'cancelled' | 'refunded';
}

export interface OrderTrackingActivity {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: number;
}

export interface OrderTrackingLiveOverlay {
  orderStatus: string | null;
  paymentStatus: string | null;
  shipment: Partial<ModelsShipment> | null;
  activities: OrderTrackingActivity[];
  pulsingStepKey: string | null;
}

export const ORDER_TRACKING_STEP_DEFS = [
  {
    key: 'confirmed',
    title: 'Order placed',
    description: 'We received your order'
  },
  {
    key: 'processing',
    title: 'Processing',
    description: 'Payment confirmed & preparing items'
  },
  {
    key: 'shipped',
    title: 'Shipped',
    description: 'Package handed to carrier'
  },
  {
    key: 'delivered',
    title: 'Delivered',
    description: 'Enjoy your purchase'
  }
] as const;

const STATUS_ACTIVE_INDEX: Record<string, number> = {
  [OrderStatus.Pending]: 0,
  [OrderStatus.Paid]: 1,
  processing: 1,
  [OrderStatus.Shipped]: 2,
  [OrderStatus.Delivered]: 3
};

/** Maps backend order status to the progress step that should pulse on live updates. */
export function getStepKeyForStatus(status: string): string {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case OrderStatus.Pending:
      return 'confirmed';
    case OrderStatus.Paid:
    case 'processing':
      return 'processing';
    case OrderStatus.Shipped:
      return 'shipped';
    case OrderStatus.Delivered:
      return 'delivered';
    default:
      return 'confirmed';
  }
}

/** Derives animated progress state from the current order status. */
export function getOrderProgressState(orderStatus: string): OrderProgressState {
  const normalized = orderStatus.toLowerCase();

  if (normalized === OrderStatus.Cancelled || normalized === OrderStatus.Refunded) {
    return {
      steps: ORDER_TRACKING_STEP_DEFS.map((step) => ({
        ...step,
        status: 'cancelled'
      })),
      progressPercent: 0,
      isTerminal: true,
      terminalType: normalized === OrderStatus.Refunded ? 'refunded' : 'cancelled'
    };
  }

  const activeIndex = STATUS_ACTIVE_INDEX[normalized] ?? 0;
  const isFullyComplete = normalized === OrderStatus.Delivered;

  const steps: OrderProgressStep[] = ORDER_TRACKING_STEP_DEFS.map((step, index) => {
    if (isFullyComplete) {
      return { ...step, status: 'completed' };
    }

    if (index < activeIndex) {
      return { ...step, status: 'completed' };
    }

    if (index === activeIndex) {
      return { ...step, status: 'active' };
    }

    return { ...step, status: 'upcoming' };
  });

  const completedCount = steps.filter((step) => step.status === 'completed').length;
  const activeCount = steps.filter((step) => step.status === 'active').length;
  const progressPercent =
    ((completedCount + activeCount * 0.55) / ORDER_TRACKING_STEP_DEFS.length) * 100;

  return {
    steps,
    progressPercent: Math.min(100, Math.max(8, progressPercent)),
    isTerminal: false
  };
}

/** Normalizes admin order detail or legacy nested order payloads for tracking UI. */
export function normalizeOrderForTracking(
  order: DtoAdminOrderDetailResponse | ModelsOrder
): ModelsOrder {
  if (!isAdminOrderDetail(order)) {
    return order;
  }

  const detail = order;
  const address = detail.shipping_address;

  return {
    id: detail.id,
    order_number: detail.order_number,
    status: detail.status,
    currency: detail.currency,
    total_amount: detail.total_amount,
    created_at: detail.created_at,
    updated_at: detail.updated_at,
    notes: detail.notes,
    tags: detail.tags?.map((tag, index) => ({ id: index, tag })),
    payment: detail.payment_status
      ? {
          status: detail.payment_status,
          method: detail.payment_method,
          amount: detail.total_amount,
          currency: detail.currency
        }
      : undefined,
    shipment:
      detail.shipment_status || detail.carrier || address
        ? {
            status: detail.shipment_status,
            carrier: detail.carrier,
            tracking_number: detail.tracking_number,
            estimated_delivery: detail.estimated_delivery,
            address_line1: address?.address_line1,
            address_line2: address?.address_line2,
            city: address?.city,
            state: address?.state,
            postal_code: address?.postal_code,
            country: address?.country
          }
        : undefined,
    items: detail.items?.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.unit_price,
      total: item.total_price,
      product:
        item.name != null
          ? {
              name: item.name,
              sku: item.sku ?? '',
              slug: item.sku ?? String(item.product_id ?? item.id ?? 'item'),
              images: item.image ? [item.image] : [],
              price: item.unit_price ?? 0
            }
          : undefined
    }))
  };
}

function isAdminOrderDetail(
  order: DtoAdminOrderDetailResponse | ModelsOrder
): order is DtoAdminOrderDetailResponse {
  return 'payment_status' in order || 'customer_email' in order || 'shipping_address' in order;
}

/** Merges REST order payload with optimistic live WebSocket overlays. */
export function mergeOrderWithLive(
  order: ModelsOrder,
  live: OrderTrackingLiveOverlay
): ModelsOrder {
  const mergedShipment =
    live.shipment != null
      ? {
          ...order.shipment,
          ...live.shipment
        }
      : order.shipment;

  const mergedPayment =
    live.paymentStatus != null
      ? {
          ...order.payment,
          status: live.paymentStatus
        }
      : order.payment;

  return {
    ...order,
    status: live.orderStatus ?? order.status,
    payment: mergedPayment,
    shipment: mergedShipment
  };
}

/** Computes order line subtotal from item rows. */
export function getOrderSubtotal(items: ModelsOrder['items']): number {
  return items?.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0) ?? 0;
}

/** Derives tax from totals when the API does not expose a dedicated tax field. */
export function getOrderTax(subtotal: number, shippingCost: number, total?: number): number {
  if (total == null || Number.isNaN(total)) return 0;
  const derived = total - subtotal - shippingCost;
  return derived > 0 ? derived : 0;
}

export function getStatusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

export function createActivityEntry(
  type: string,
  title: string,
  message: string
): OrderTrackingActivity {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title,
    message,
    timestamp: Date.now()
  };
}
