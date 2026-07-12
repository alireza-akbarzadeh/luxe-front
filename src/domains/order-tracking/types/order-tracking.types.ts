/** Storefront order-tracking view types — mirrors backend OrderTrackingDetailView. */

export interface OrderTrackingMilestone {
  key: string;
  title: string;
  description?: string;
  status: 'completed' | 'active' | 'upcoming' | string;
  occurred_at?: string;
}

export interface OrderTrackingEvent {
  id: string;
  type: string;
  title: string;
  message?: string;
  timestamp: string;
}

export interface OrderTrackingDelivery {
  recipient_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  instructions?: string;
  service_name?: string;
  package_weight_kg?: number;
  package_dimensions?: string;
  insurance_included?: boolean;
  signature_required?: boolean;
  destination_lat?: number;
  destination_lng?: number;
  hub_lat?: number;
  hub_lng?: number;
  distance_miles?: number;
  stops_remaining?: number;
}

export interface OrderTrackingPaymentSummary {
  subtotal?: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  currency?: string;
  method?: string;
  transaction_id?: string;
  card_last4?: string;
}

export interface OrderTrackingDriver {
  name?: string;
  rating?: number;
  carrier?: string;
  vehicle?: string;
  license_plate?: string;
  estimated_arrival?: string;
}

export interface OrderTrackingCourier {
  name?: string;
  tracking_number?: string;
  service?: string;
  total_items?: number;
}

export interface OrderTrackingDetail {
  status_label?: string;
  progress_percent?: number;
  estimated_arrival?: string;
  milestones?: OrderTrackingMilestone[];
  events?: OrderTrackingEvent[];
  delivery?: OrderTrackingDelivery;
  payment_summary?: OrderTrackingPaymentSummary;
  driver?: OrderTrackingDriver;
  courier?: OrderTrackingCourier;
}

export interface OrderTrackingItem {
  id?: number;
  productId?: number;
  name: string;
  image?: string;
  sku?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTrackingPageView {
  id: number;
  orderNumber: string;
  status: string;
  createdAt?: string;
  currency?: string;
  items: OrderTrackingItem[];
  tracking: OrderTrackingDetail;
}
