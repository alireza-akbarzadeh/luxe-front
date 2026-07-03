import type { Metadata } from 'next';

import { ShopTheLookDetailDomain } from '@/domains/shop-the-look/shop-the-look-detail.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: 'Shop the Look',
    description: 'Tap tagged pieces in this curated scene to shop the full edit.',
    path: `/shop-the-look/${slug}`
  });
}

export default async function ShopTheLookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ShopTheLookDetailDomain slug={slug} />;
}
