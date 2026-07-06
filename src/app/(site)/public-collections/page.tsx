import type { Metadata } from 'next';

import { PublicCollectionsDomain } from '@/domains/public-collections/public-collections.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Public Collections',
  description:
    'Browse community-published product collections — curated boards you can shop in one place.',
  path: '/public-collections'
});

export default function PublicCollectionsPage() {
  return <PublicCollectionsDomain />;
}
