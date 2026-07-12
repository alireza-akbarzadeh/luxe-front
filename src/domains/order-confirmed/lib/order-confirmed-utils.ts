import { addDays, format } from 'date-fns';

import { DATE_FORMATS, formatDate } from '@/lib/date';

import type { OrderConfirmedShippingView } from './order-confirmed-mapper';

export type OrderPaymentBrand =
  | 'stripe'
  | 'paypal'
  | 'apple'
  | 'google'
  | 'card'
  | 'wallet'
  | 'generic';

export interface OrderPaymentDisplay {
  label: string;
  brand: OrderPaymentBrand;
}

/** Maps API payment_method to a display label and brand icon key. */
export function resolvePaymentMethodDisplay(method?: string): OrderPaymentDisplay {
  if (!method) {
    return { label: '—', brand: 'generic' };
  }

  const normalized = method.toLowerCase().replace(/-/g, '_');

  switch (normalized) {
    case 'stripe':
      return { label: 'Stripe', brand: 'stripe' };
    case 'paypal':
      return { label: 'PayPal', brand: 'paypal' };
    case 'apple_pay':
      return { label: 'Apple Pay', brand: 'apple' };
    case 'google_pay':
      return { label: 'Google Pay', brand: 'google' };
    case 'wallet':
    case 'store_credit':
      return { label: 'Wallet', brand: 'wallet' };
    case 'mock':
      return { label: 'Card', brand: 'card' };
    default:
      return {
        label: method.replace(/_/g, ' '),
        brand: normalized.includes('card') ? 'card' : 'generic'
      };
  }
}

export interface DeliveryEstimateDisplay {
  range: string;
  useFallbackWindow: boolean;
}

/** Formats estimated delivery — API date or a 3–5 day window from order date. */
export function formatDeliveryEstimate(
  estimatedDelivery?: string,
  createdAt?: string
): DeliveryEstimateDisplay | null {
  if (estimatedDelivery) {
    return {
      range: formatDate(estimatedDelivery, DATE_FORMATS.SHORT),
      useFallbackWindow: false
    };
  }

  if (!createdAt) return null;

  const base = new Date(createdAt);
  const start = addDays(base, 3);
  const end = addDays(base, 5);
  const sameYear = start.getFullYear() === end.getFullYear();

  const range = sameYear
    ? `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
    : `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`;

  return { range, useFallbackWindow: true };
}

export interface ShippingAddressDisplay {
  name: string;
  lines: string[];
}

/** Builds shipping recipient + address lines for the confirmation card. */
export function formatShippingAddressFromView(
  shipping?: OrderConfirmedShippingView
): ShippingAddressDisplay | null {
  if (!shipping) return null;

  const name = shipping.name?.trim() ?? '';
  const lines = [
    [shipping.addressLine1, shipping.addressLine2].filter(Boolean).join(', '),
    [shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(', '),
    shipping.country
  ].filter((line): line is string => Boolean(line && line.length > 0));

  if (!name && lines.length === 0) return null;

  return { name, lines };
}
