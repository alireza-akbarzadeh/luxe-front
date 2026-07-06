import type { Metadata } from 'next';

import { PublicCollectionDetailDomain } from '@/domains/public-collections/public-collection-detail.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

type PublicCollectionDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: PublicCollectionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: 'Public Collection',
    description: 'Shop a community-published collection on Luxe.',
    path: `/public-collections/${slug}`
  });
}

export default async function PublicCollectionDetailPage({
  params
}: PublicCollectionDetailPageProps) {
  const { slug } = await params;
  return <PublicCollectionDetailDomain slug={slug} />;
}
