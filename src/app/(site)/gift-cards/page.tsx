import type { Metadata } from 'next';

import { GiftCardsDomain } from '@/domains/gift-cards/gift-cards.domain';

export const metadata: Metadata = {
  title: 'Gift Cards — Luxe Marketplace',
  description: 'Purchase and redeem Luxe digital gift cards for the marketplace.'
};

export default function GiftCardsPage() {
  return <GiftCardsDomain />;
}
