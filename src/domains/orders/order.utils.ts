import type { Order, OrderStatus, PaymentStatus } from '@/domains/orders/orders-types';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';
import type { DtoAdminOrderListItem } from '@/services/-orders-get.schemas';

const UI_STATUS_TO_API: Record<OrderStatus | 'All', string | undefined> = {
  All: undefined,
  Pending: 'pending',
  Processing: 'paid',
  Fulfilled: 'paid',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
  Refunded: 'refunded'
};

/** Maps admin table status tabs to backend order status filters. */
export function mapUiStatusToApi(status: OrderStatus | 'All'): string | undefined {
  return UI_STATUS_TO_API[status];
}

/** Maps backend order status to admin UI labels. */
export function mapApiStatusToUi(status?: string): OrderStatus {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'paid':
    case 'delayed':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    case 'refunded':
      return 'Refunded';
    default:
      return 'Pending';
  }
}

/** Maps backend payment status to admin UI labels. */
export function mapApiPaymentStatusToUi(
  paymentStatus?: string,
  orderStatus?: string
): PaymentStatus {
  if (orderStatus?.toLowerCase() === 'refunded') {
    return 'Refunded';
  }

  switch (paymentStatus?.toLowerCase()) {
    case 'completed':
    case 'succeeded':
      return 'Paid';
    case 'refunded':
      return 'Refunded';
    case 'partial':
      return 'Partial';
    default:
      return 'Unpaid';
  }
}

/** Maps an admin order list row from the API into the orders table domain model. */
export function mapApiOrderToDomain(item: DtoAdminOrderListItem): Order {
  const customerName = item.customer_name?.trim() || 'Unknown Customer';

  return {
    id: String(item.id ?? ''),
    order_number: item.order_number ?? '',
    customer_name: customerName,
    customer_email: item.customer_email ?? '',
    customer_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=random`,
    status: mapApiStatusToUi(item.status),
    payment_status: mapApiPaymentStatusToUi(item.payment_status, item.status),
    payment_method: 'Card',
    subtotal: item.total_amount ?? 0,
    discount: 0,
    shipping_cost: 0,
    tax: 0,
    total: item.total_amount ?? 0,
    currency: item.currency ?? 'USD',
    channel: 'Web',
    priority: 'Normal',
    tracking_number: '',
    carrier: '',
    estimated_delivery: '',
    ordered_at: item.created_at ?? '',
    notes: '',
    tags: [],
    items: [],
    items_count: item.items_count ?? 0,
    shipping_address: {
      line1: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    billing_address: {
      line1: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    timeline: []
  };
}

export function mapApiOrdersToDomain(items: DtoAdminOrderListItem[] | undefined): Order[] {
  return (items ?? []).map(mapApiOrderToDomain);
}

/** Maps the admin order detail response into the orders domain model. */
export function mapApiOrderDetailToDomain(detail: DtoAdminOrderDetailResponse): Order {
  const customerName = detail.customer_name?.trim() || 'Unknown Customer';

  return {
    id: String(detail.id ?? ''),
    order_number: detail.order_number ?? '',
    customer_name: customerName,
    customer_email: detail.customer_email ?? '',
    customer_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=random`,
    status: mapApiStatusToUi(detail.status),
    payment_status: mapApiPaymentStatusToUi(detail.payment_status, detail.status),
    payment_method: detail.payment_method || 'Card',
    subtotal: detail.total_amount ?? 0,
    discount: 0,
    shipping_cost: 0,
    tax: 0,
    total: detail.total_amount ?? 0,
    currency: detail.currency ?? 'USD',
    channel: 'Web',
    priority: 'Normal',
    tracking_number: detail.tracking_number ?? '',
    carrier: detail.carrier ?? '',
    estimated_delivery: detail.estimated_delivery ?? '',
    ordered_at: detail.created_at ?? '',
    notes: detail.notes ?? '',
    tags: [],
    items_count: detail.items?.length ?? 0,
    items: (detail.items ?? []).map((item) => ({
      product_id: String(item.product_id ?? ''),
      name: item.name ?? 'Product',
      sku: item.sku ?? '',
      image: item.image ?? '',
      quantity: item.quantity ?? 0,
      unit_price: item.unit_price ?? 0,
      total_price: item.total_price ?? 0,
      category: item.category ?? ''
    })),
    shipping_address: {
      line1: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    billing_address: {
      line1: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    timeline: detail.created_at
      ? [
          {
            event: mapApiStatusToUi(detail.status),
            description: `Order ${detail.order_number ?? ''} created`,
            timestamp: detail.created_at,
            actor: 'System'
          }
        ]
      : []
  };
}
