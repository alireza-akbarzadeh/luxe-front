import type { Metadata } from 'next';

import { ReverseMarketplaceCreateDomain } from '@/domains/reverse-marketplace/reverse-marketplace-create.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Post a Wanted Listing',
  description: 'Tell sellers what you are looking for and receive offers from Luxe vendors.',
  path: '/reverse-marketplace/new'
});

export default function ReverseMarketplaceNewPage() {
  return <ReverseMarketplaceCreateDomain />;
}
