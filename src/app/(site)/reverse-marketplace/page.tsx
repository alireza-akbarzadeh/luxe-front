import type { Metadata } from 'next';

import { ReverseMarketplaceDomain } from '@/domains/reverse-marketplace/reverse-marketplace.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Reverse Marketplace',
  description: 'Post what you want to buy and let verified vendors respond with tailored offers.',
  path: '/reverse-marketplace'
});

export default function ReverseMarketplacePage() {
  return <ReverseMarketplaceDomain />;
}
