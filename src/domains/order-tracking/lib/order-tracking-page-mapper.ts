import { OrderStatus } from '@/lib/constants/enum-statuses';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';
import type { ModelsOrder } from '@/services/-orders-my-get.schemas';

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
};

const MILESTONE_DEFS = [
  { key: 'order_confirmed', title: 'Order Confirmed', description: 'We received your order' },
  {
    key: 'payment_received',
    title: 'Payment Received',
    description: 'Payment verified successfully'
  },
  {
    key: 'warehouse_processing',
    title: 'Warehouse Processing',
    description: 'Items picked from inventory'
  },
  {
    key: 'quality_inspection',
    title: 'Quality Inspection',
    description: 'Products checked before packing'
  },
  { key: 'packaged', title: 'Packaged', description: 'Order sealed and labeled' },
  { key: 'shipped', title: 'Shipped', description: 'Handed to carrier' },
  { key: 'out_for_delivery', title: 'Out for Delivery', description: 'Driver is on the way' },
  { key: 'delivered', title: 'Delivered', description: 'Package received' }
] as const;

function isAdminDetail(order: OrderPayload): order is OrderWithTracking {
  return 'payment_status' in order || 'customer_email' in order || 'shipping_address' in order;
}

function activeIndexForStatus(
  status?: string,
  paymentStatus?: string,
  shipmentStatus?: string
): number {
  const s = status?.toLowerCase() ?? '';
  const pay = paymentStatus?.toLowerCase() ?? '';
  const ship = shipmentStatus?.toLowerCase() ?? '';

  switch (s) {
    case OrderStatus.Delivered:
      return 8;
    case OrderStatus.Cancelled:
    case OrderStatus.Refunded:
      return 0;
    case OrderStatus.Shipped:
      return ship === 'out_for_delivery' || ship === 'in_transit' ? 7 : 6;
    case OrderStatus.Paid:
    case 'delayed':
      return pay === 'succeeded' || pay === 'completed' ? 3 : 2;
    case OrderStatus.Pending:
      return pay === 'succeeded' || pay === 'completed' ? 2 : 1;
    default:
      return 1;
  }
}

function statusLabel(status?: string, shipmentStatus?: string): string {
  const s = status?.toLowerCase() ?? '';
  const ship = shipmentStatus?.toLowerCase() ?? '';
  switch (s) {
    case OrderStatus.Delivered:
      return 'Delivered';
    case OrderStatus.Shipped:
      return ship === 'out_for_delivery' || ship === 'in_transit' ? 'In Transit' : 'Shipped';
    case OrderStatus.Paid:
      return 'Processing';
    case OrderStatus.Cancelled:
      return 'Cancelled';
    case OrderStatus.Refunded:
      return 'Refunded';
    default:
      return 'Order Placed';
  }
}

function synthesizeTracking(order: OrderPayload): OrderTrackingDetail {
  const normalized = normalizeOrderForTracking(order);
  const detail = isAdminDetail(order) ? order : null;
  const paymentStatus = detail?.payment_status ?? normalized.payment?.status;
  const shipmentStatus = detail?.shipment_status ?? normalized.shipment?.status;
  const activeIndex = activeIndexForStatus(normalized.status, paymentStatus, shipmentStatus);

  const milestones: OrderTrackingMilestone[] = MILESTONE_DEFS.map((def, index) => {
    const step = index + 1;
    let status: OrderTrackingMilestone['status'] = 'upcoming';
    if (step < activeIndex) status = 'completed';
    else if (step === activeIndex) status = 'active';

    return {
      key: def.key,
      title: def.title,
      description: def.description,
      status,
      occurred_at:
        def.key === 'order_confirmed'
          ? normalized.created_at
          : def.key === 'payment_received'
            ? normalized.created_at
            : def.key === 'shipped'
              ? normalized.shipment?.shipped_at
              : def.key === 'delivered'
                ? undefined
                : undefined
    };
  });

  const events: OrderTrackingEvent[] = [
    {
      id: `confirmed-${normalized.id}`,
      type: 'order_confirmed',
      title: 'Order confirmed',
      message: `Order #${normalized.order_number ?? normalized.id} was placed successfully.`,
      timestamp: String(normalized.created_at ?? new Date().toISOString())
    }
  ];

  if (normalized.status === OrderStatus.Paid || normalized.status === OrderStatus.Shipped) {
    events.unshift({
      id: `processing-${normalized.id}`,
      type: 'warehouse_processing',
      title: 'Warehouse processing',
      message: 'Your items are being prepared for shipment.',
      timestamp: String(normalized.updated_at ?? normalized.created_at ?? new Date().toISOString())
    });
  }

  if (normalized.status === OrderStatus.Shipped || normalized.shipment?.tracking_number) {
    events.unshift({
      id: `shipped-${normalized.id}`,
      type: 'shipped',
      title: 'Out for delivery',
      message: normalized.shipment?.tracking_number
        ? `Tracking number ${normalized.shipment.tracking_number} is active.`
        : 'Your package has left our facility.',
      timestamp: String(
        normalized.shipment?.shipped_at ?? normalized.updated_at ?? new Date().toISOString()
      )
    });
  }

  const items = normalized.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
  const shipping = normalized.shipment?.shipping_price ?? 0;
  const total = normalized.total_amount ?? subtotal + shipping;
  const tax = Math.max(0, total - subtotal - shipping);

  const address = normalized.shipment;
  const lat = 40.758;
  const lng = -73.9855;

  return {
    status_label: statusLabel(normalized.status, shipmentStatus),
    progress_percent: Math.min(
      100,
      Math.max(8, Math.round((activeIndex / MILESTONE_DEFS.length) * 100))
    ),
    estimated_arrival: normalized.shipment?.estimated_delivery
      ? String(normalized.shipment.estimated_delivery)
      : undefined,
    milestones,
    events,
    delivery: {
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
    payment_summary: {
      subtotal,
      discount: 0,
      shipping,
      tax,
      total,
      currency: normalized.currency,
      method: normalized.payment?.method ?? detail?.payment_method,
      transaction_id: normalized.payment?.transaction_id
    },
    courier: {
      name: detail?.carrier ?? address?.carrier ?? 'Standard Shipping',
      tracking_number: detail?.tracking_number ?? address?.tracking_number,
      service: 'Express Delivery',
      total_items: itemCount
    },
    driver:
      activeIndex >= 6 && normalized.status !== OrderStatus.Delivered
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
        : undefined
  };
}

/** Maps GET /orders/:id into the tracking page view model. */
export function mapOrderToTrackingPageView(order: OrderPayload): OrderTrackingPageView {
  const normalized = normalizeOrderForTracking(order);
  const detail = isAdminDetail(order) ? order : null;
  const tracking = detail?.tracking ?? synthesizeTracking(order);

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
