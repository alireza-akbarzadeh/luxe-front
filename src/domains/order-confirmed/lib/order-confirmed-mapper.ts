import type { ModelsOrder } from '@/services/-checkout-confirm-stripe-post.schemas';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';

export interface OrderConfirmedItemView {
  id?: number;
  name?: string;
  image?: string;
  sku?: string;
  category?: string;
  quantity?: number;
  totalPrice?: number;
}

export interface OrderConfirmedShippingView {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

/** Normalized order shape for the confirmation page — supports API detail and Stripe confirm payloads. */
export interface OrderConfirmedView {
  id?: number;
  orderNumber: string;
  createdAt?: string;
  estimatedDelivery?: string;
  paymentMethod?: string;
  status?: string;
  totalAmount?: number;
  currency?: string;
  items: OrderConfirmedItemView[];
  shipping?: OrderConfirmedShippingView;
}

function isAdminOrderDetail(
  order: DtoAdminOrderDetailResponse | ModelsOrder
): order is DtoAdminOrderDetailResponse {
  return 'shipping_address' in order || 'payment_status' in order || 'customer_email' in order;
}

/** Maps either order API response into a single view model for confirmation UI. */
export function mapOrderToConfirmedView(
  order: DtoAdminOrderDetailResponse | ModelsOrder
): OrderConfirmedView {
  if (isAdminOrderDetail(order)) {
    const address = order.shipping_address;

    return {
      id: order.id,
      orderNumber: order.order_number ?? String(order.id ?? ''),
      createdAt: order.created_at,
      estimatedDelivery: order.estimated_delivery,
      paymentMethod: order.payment_method,
      status: order.status,
      totalAmount: order.total_amount,
      currency: order.currency,
      items:
        order.items?.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          sku: item.sku,
          category: item.category,
          quantity: item.quantity,
          totalPrice: item.total_price
        })) ?? [],
      shipping: address
        ? {
            name: order.customer_name,
            addressLine1: address.address_line1,
            addressLine2: address.address_line2,
            city: address.city,
            state: address.state,
            postalCode: address.postal_code,
            country: address.country
          }
        : order.customer_name
          ? { name: order.customer_name }
          : undefined
    };
  }

  const shipment = order.shipment;

  return {
    id: order.id,
    orderNumber: order.order_number ?? String(order.id ?? ''),
    createdAt: order.created_at,
    estimatedDelivery: shipment?.estimated_delivery,
    paymentMethod: order.payment?.method,
    status: order.status,
    totalAmount: order.total_amount,
    currency: order.currency,
    items:
      order.items?.map((item) => ({
        id: item.id,
        name: item.product?.name,
        image: item.product?.images?.[0],
        sku: item.product?.sku,
        category: item.product?.category?.name,
        quantity: item.quantity,
        totalPrice: item.total ?? (item.price ?? 0) * (item.quantity ?? 0)
      })) ?? [],
    shipping: shipment
      ? {
          addressLine1: shipment.address_line1,
          addressLine2: shipment.address_line2,
          city: shipment.city,
          state: shipment.state,
          postalCode: shipment.postal_code,
          country: shipment.country
        }
      : undefined
  };
}
