import type { Metadata } from 'next';

import { ShoppingMemoryDomain } from '@/domains/shopping-memory/shopping-memory.domain';

export const metadata: Metadata = {
  title: 'Shopping Memory — Luxe',
  description: 'AI summary of your browsing taste and personalized product picks.'
};

export default function ShoppingMemoryPage() {
  return <ShoppingMemoryDomain />;
}
