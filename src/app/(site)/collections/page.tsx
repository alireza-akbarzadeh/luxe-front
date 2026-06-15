import type { Metadata } from 'next';

import { CollectionsDomain } from '@/domains/collections/collections.domain';

export const metadata: Metadata = {
  title: 'Collections — Luxe Marketplace',
  description: 'Explore curated Luxe collections — seasonal edits, trending picks, and sale highlights.'
};

export default function CollectionsPage() {
  return <CollectionsDomain />;
}
