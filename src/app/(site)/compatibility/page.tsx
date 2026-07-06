import type { Metadata } from 'next';

import { CompatibilityDomain } from '@/domains/compatibility/compatibility.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Compatibility check',
  description: 'See how well two Luxe catalog products work together.',
  path: '/compatibility'
});

export default function CompatibilityPage() {
  return <CompatibilityDomain />;
}
