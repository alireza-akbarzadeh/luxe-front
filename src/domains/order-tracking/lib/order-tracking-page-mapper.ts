import type { WorkflowHistoryEntry } from '@/domains/workflows/types/workflow-runtime.types';
import { OrderStatus } from '@/lib/constants/enum-statuses';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';
import type { ModelsOrder } from '@/services/-orders-my-get.schemas';
import type { DtoStateView } from '@/services/-workflows-{key}-get.schemas';

import type {
  OrderTrackingDetail,
  OrderTrackingEvent,
  OrderTrackingMilestone,
  OrderTrackingPageView
} from '../types/order-tracking.types';
import { normalizeOrderForTracking } from './order-tracking-utils';

type OrderPayload = DtoAdminOrderDetailResponse | ModelsOrder;

type OrderWithTracking = DtoAdminOrderDetailResponse & {
  tracking?: OrderTrackingDetail;
  workflow_state?: DtoStateView;
};

export interface MapOrderTrackingOptions {
  /** Workflow definition states for the order entity — drives the progress timeline. */
  workflowStates?: DtoStateView[];
  /** Workflow history entries — drives the activity feed. */
  workflowHistory?: WorkflowHistoryEntry[];
}

function isAdminDetail(order: OrderPayload): order is OrderWithTracking {
  return 'payment_status' in order || 'customer_email' in order || 'shipping_address' in order;
}

function resolveCurrentStateCode(order: OrderPayload, normalizedStatus?: string): string {
  const detail = isAdminDetail(order) ? order : null;
  const fromWorkflow = detail?.workflow_state?.code?.toLowerCase();
  if (fromWorkflow) return fromWorkflow;

  const status = (normalizedStatus ?? detail?.status ?? '').toLowerCase();
  if (status === OrderStatus.Pending) return 'pending';
  if (status === OrderStatus.Paid) return 'paid';
  if (status === 'processing') return 'packed';
  if (status === OrderStatus.Shipped) return 'shipped';
  if (status === OrderStatus.Delivered) return 'delivered';
  if (status === OrderStatus.Cancelled) return 'cancelled';
  if (status === OrderStatus.Refunded) return 'refunded';
  return status || 'pending';
}

function statusLabelFromWorkflow(
  states: DtoStateView[],
  currentCode: string,
  fallbackStatus?: string
): string {
  const match = states.find((s) => s.code?.toLowerCase() === currentCode);
  if (match?.name) return match.name;
  return (fallbackStatus ?? currentCode).replace(/_/g, ' ');
}

/** Builds progress milestones from the order workflow definition (sorted by sort_order). */
export function buildMilestonesFromWorkflow(
  states: DtoStateView[],
  currentCode: string,
  history: WorkflowHistoryEntry[] = []
): OrderTrackingMilestone[] {
  const sorted = [...states]
    .filter(
      (s) => s.code && s.code.toLowerCase() !== 'cancelled' && s.code.toLowerCase() !== 'refunded'
    )
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  if (sorted.length === 0) return [];

  const currentIndex = sorted.findIndex((s) => s.code?.toLowerCase() === currentCode);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const isFinal = sorted[activeIndex]?.is_final === true || currentCode === OrderStatus.Delivered;

  const occurredByCode = new Map<string, string>();
  for (const entry of history) {
    const code = entry.to_state?.code?.toLowerCase();
    if (code && entry.created_at && !occurredByCode.has(code)) {
      occurredByCode.set(code, entry.created_at);
    }
  }

  return sorted.map((state, index) => {
    const key = state.code ?? `state-${state.id ?? index}`;
    let status: OrderTrackingMilestone['status'] = 'upcoming';
    if (isFinal || index < activeIndex) status = 'completed';
    else if (index === activeIndex) status = 'active';

    // OpenAPI DtoStateView omits description; workflow model has it — keep optional until api:gen.
    const description = (state as DtoStateView & { description?: string }).description;

    return {
      key,
      title: state.name ?? key,
      description: description || undefined,
      status,
      occurred_at: occurredByCode.get(key.toLowerCase()),
      color: state.color,
      text_color: state.text_color
    };
  });
}

function buildEventsFromHistory(history: WorkflowHistoryEntry[]): OrderTrackingEvent[] {
  return history.map((entry, index) => ({
    id: String(entry.id ?? `hist-${index}`),
    type: entry.event ?? entry.to_state?.code ?? 'update',
    title: entry.to_state?.name ?? entry.event?.replace(/_/g, ' ') ?? 'Status update',
    message:
      entry.note ||
      (entry.from_state?.name
        ? `${entry.from_state.name} → ${entry.to_state?.name ?? ''}`
        : undefined),
    timestamp: entry.created_at ?? new Date().toISOString()
  }));
}

function synthesizeTracking(
  order: OrderPayload,
  options: MapOrderTrackingOptions = {}
): OrderTrackingDetail {
  const normalized = normalizeOrderForTracking(order);
  const detail = isAdminDetail(order) ? order : null;
  const states = options.workflowStates ?? [];
  const history = options.workflowHistory ?? [];
  const currentCode = resolveCurrentStateCode(order, normalized.status);

  const milestones = buildMilestonesFromWorkflow(states, currentCode, history);
  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const activeCount = milestones.filter((m) => m.status === 'active').length;
  const progressPercent =
    milestones.length === 0
      ? 8
      : Math.min(
          100,
          Math.max(8, Math.round(((completedCount + activeCount * 0.55) / milestones.length) * 100))
        );

  const items = normalized.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
  const shipping = normalized.shipment?.shipping_price ?? 0;
  const total = normalized.total_amount ?? subtotal + shipping;
  const tax = Math.max(0, total - subtotal - shipping);

  const address = normalized.shipment;
  const lat = 40.758;
  const lng = -73.9855;
  const isInTransit =
    currentCode === 'shipped' ||
    currentCode === 'out_for_delivery' ||
    currentCode === 'in_transit' ||
    normalized.status === OrderStatus.Shipped;

  const apiTracking = detail?.tracking;

  return {
    status_label:
      apiTracking?.status_label ?? statusLabelFromWorkflow(states, currentCode, normalized.status),
    progress_percent: apiTracking?.progress_percent ?? progressPercent,
    estimated_arrival:
      apiTracking?.estimated_arrival ??
      (normalized.shipment?.estimated_delivery
        ? String(normalized.shipment.estimated_delivery)
        : undefined),
    milestones: milestones.length > 0 ? milestones : (apiTracking?.milestones ?? []),
    events: history.length > 0 ? buildEventsFromHistory(history) : (apiTracking?.events ?? []),
    delivery: apiTracking?.delivery ?? {
      recipient_name: detail?.customer_name,
      address_line1: address?.address_line1,
      address_line2: address?.address_line2,
      city: address?.city,
      state: address?.state,
      postal_code: address?.postal_code,
      country: address?.country,
      instructions: normalized.notes,
      service_name: address?.carrier ?? 'Standard Delivery',
      package_weight_kg: Math.max(1.2, itemCount * 1.1),
      package_dimensions: itemCount >= 3 ? '32 x 24 x 12 cm' : '24 x 18 x 8 cm',
      insurance_included: total >= 100,
      signature_required: total >= 250,
      destination_lat: lat,
      destination_lng: lng,
      hub_lat: lat + 0.04,
      hub_lng: lng - 0.06,
      distance_miles: 2.4,
      stops_remaining: 3
    },
    payment_summary: apiTracking?.payment_summary ?? {
      subtotal,
      discount: 0,
      shipping,
      tax,
      total,
      currency: normalized.currency,
      method: normalized.payment?.method ?? detail?.payment_method,
      transaction_id: normalized.payment?.transaction_id
    },
    courier: apiTracking?.courier ?? {
      name: detail?.carrier ?? address?.carrier ?? 'Standard Shipping',
      tracking_number: detail?.tracking_number ?? address?.tracking_number,
      service: 'Express Delivery',
      total_items: itemCount
    },
    driver:
      apiTracking?.driver ??
      (isInTransit && normalized.status !== OrderStatus.Delivered
        ? {
            name: 'Michael Brown',
            rating: 4.9,
            carrier: detail?.carrier ?? address?.carrier ?? 'Courier',
            vehicle: 'Delivery Van',
            license_plate: 'DHL-7842',
            estimated_arrival: normalized.shipment?.estimated_delivery
              ? String(normalized.shipment.estimated_delivery)
              : undefined
          }
        : undefined)
  };
}

/** Maps GET /orders/:id (+ optional workflow definition/history) into the tracking page view. */
export function mapOrderToTrackingPageView(
  order: OrderPayload,
  options: MapOrderTrackingOptions = {}
): OrderTrackingPageView {
  const normalized = normalizeOrderForTracking(order);
  const detail = isAdminDetail(order) ? order : null;
  const tracking = synthesizeTracking(order, options);

  return {
    id: normalized.id ?? 0,
    orderNumber: normalized.order_number ?? String(normalized.id ?? ''),
    status: normalized.status ?? OrderStatus.Pending,
    createdAt: normalized.created_at ? String(normalized.created_at) : undefined,
    currency: normalized.currency,
    items:
      detail?.items?.map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.name ?? 'Product',
        image: item.image,
        sku: item.sku,
        category: item.category,
        quantity: item.quantity ?? 1,
        unitPrice: item.unit_price ?? 0,
        totalPrice: item.total_price ?? 0
      })) ??
      (normalized.items ?? []).map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.product?.name ?? 'Product',
        image: item.product?.images?.[0],
        sku: item.product?.sku,
        quantity: item.quantity ?? 1,
        unitPrice: item.price ?? 0,
        totalPrice: item.total ?? (item.price ?? 0) * (item.quantity ?? 0)
      })),
    tracking
  };
}
