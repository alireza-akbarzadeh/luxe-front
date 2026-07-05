import type { Metadata } from 'next';

import { MoodShoppingDomain } from '@/domains/mood-shopping/mood-shopping.domain';

export const metadata: Metadata = {
  title: 'Mood Shopping — Luxe',
  description: 'Shop by mood — pick a vibe and discover products that match your energy.'
};

export default function MoodShoppingPage() {
  return <MoodShoppingDomain />;
}
