import type { Metadata } from 'next';

import { SupportReturns } from '~/src/domains/support/sections/support-returns';

export const metadata: Metadata = {
  title: 'Returns & Refunds — Luxe Marketplace',
  description: '30-day free returns, easy exchanges, and refunds processed within 5 business days.'
};

export default function ReturnsPage() {
  return <SupportReturns />;
}
