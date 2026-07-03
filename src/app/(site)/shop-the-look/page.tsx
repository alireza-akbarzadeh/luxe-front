import type { Metadata } from 'next';

import { ShopTheLookDomain } from '@/domains/shop-the-look/shop-the-look.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Shop the Look',
  description:
    'Explore curated lifestyle scenes and tap each tagged piece to shop the full edit.',
  path: '/shop-the-look'
});

export default function ShopTheLookPage() {
  return <ShopTheLookDomain />;
}
