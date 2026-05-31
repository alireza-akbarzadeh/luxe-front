import type { Metadata } from 'next';

import SupportOrderTracking from '@/domains/support/sections/support-order-tracking';

export const metadata: Metadata = {
  title: 'Order Tracking — Luxe Marketplace',
  description:
    'How to track your order, what each status means, and what to do if your package is delayed.'
};

export default function OrderTrackingPage() {
  return <SupportOrderTracking />;
}
