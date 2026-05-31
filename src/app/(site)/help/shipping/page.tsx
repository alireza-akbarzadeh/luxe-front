import type { Metadata } from 'next';

import { SupportShipping } from '@/domains/support/sections/support-shipping';

export const metadata: Metadata = {
  title: 'Shipping & Delivery — Luxe Marketplace',
  description:
    'Delivery options, transit times, customs, duties and signature requirements for every Luxe order.'
};

export default function ShippingPage() {
  return <SupportShipping />;
}
