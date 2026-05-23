// Cart statuses
export const CartStatus = {
  Active: 'active',
  Abandoned: 'abandoned',
  Converted: 'converted'
} as const;
export type CartStatus = (typeof CartStatus)[keyof typeof CartStatus];

// Order statuses
export const OrderStatus = {
  Pending: 'pending',
  Paid: 'paid',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
  Refunded: 'refunded'
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

// Payment statuses
export const PaymentStatus = {
  Pending: 'pending',
  Completed: 'completed',
  Failed: 'failed'
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// Shipment statuses
export const ShipmentStatus = {
  Pending: 'pending',
  Shipped: 'shipped',
  Delivered: 'delivered'
} as const;
export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

// User roles
export const UserRole = {
  User: 'user',
  Admin: 'admin'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Product statuses
export const ProductStatus = {
  Draft: 'draft',
  Active: 'active',
  Inactive: 'inactive',
  Archived: 'archived'
} as const;
export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
