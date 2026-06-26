import type { Metadata } from 'next';

import { CollectionsDomain } from '@/domains/collections/collections.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Collections',
  description:
    'Explore curated Luxe collections — seasonal edits, trending picks, and sale highlights.',
  path: '/collections'
});

export default function CollectionsPage() {
  return <CollectionsDomain />;
}
