import type { Metadata } from 'next';

import { CreatorStorefrontsDomain } from '@/domains/creator-storefronts/creator-storefronts.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Creator Storefronts',
  description:
    'Discover curated edits from style creators — shop their hand-picked luxury pieces in one place.',
  path: '/creators'
});

export default function CreatorsPage() {
  return <CreatorStorefrontsDomain />;
}
