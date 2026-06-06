// Type definitions for statuses
type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Fulfilled'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';
type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded' | 'Partial';
type PriorityLevel = 'Low' | 'Normal' | 'High' | 'Urgent';

// Badge size type
type BadgeSize = 'sm' | 'md';

// Config types
type StatusConfig = {
  color: string;
  dot: string;
};

type PriorityConfig = {
  color: string;
};

type SortableKey = 'order_number' | 'total' | 'ordered_at';
type SortDirection = 'asc' | 'desc';

interface SortableHeadProps {
  label: string;
  colKey: SortableKey;
  currentSortKey: string | null;
  currentSortDir: SortDirection | null;
  onSort: (key: SortableKey) => void;
}

interface Filter {
  id: string;
  value: string[] | ((old: string[]) => string[] | null) | null;
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Timeline event
interface TimelineEvent {
  event: string;
  description: string;
  timestamp: string;
  actor: string;
}

// Order item
interface OrderItem {
  product_id: string;
  name: string;
  sku: string;
  image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: string;
}

// Main Order type
interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_avatar: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  currency: string;
  channel: string; // 'Web' | 'Mobile App' | 'Phone' (if you have a type, replace)
  priority: PriorityLevel;
  tracking_number: string;
  carrier: string;
  estimated_delivery: string;
  ordered_at: string;
  notes: string;
  tags: string[];
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  timeline: TimelineEvent[];
}

export type {
  Address,
  BadgeSize,
  Filter,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PriorityConfig,
  PriorityLevel,
  SortableHeadProps,
  SortableKey,
  SortDirection,
  StatusConfig,
  TimelineEvent
};
