import type { Metadata } from 'next';

import { GiftFinderDomain } from '@/domains/gift-finder/gift-finder.domain';

export const metadata: Metadata = {
  title: 'Gift Finder — Luxe Marketplace',
  description:
    'Answer a few questions and get AI-powered gift ideas from the Luxe catalog — by recipient, occasion, and budget.'
};

export default function GiftCardsFinderPage() {
  return <GiftFinderDomain />;
}
