import type { Metadata } from 'next';

import { CommunityShoppingListDetailDomain } from '@/domains/community-shopping-lists/community-shopping-list-detail.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

type CommunityListDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params
}: CommunityListDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: 'Community Shopping List',
    description: 'Shop a community-curated list on Luxe.',
    path: `/lists/${slug}`
  });
}

export default async function CommunityListDetailPage({ params }: CommunityListDetailPageProps) {
  const { slug } = await params;
  return <CommunityShoppingListDetailDomain slug={slug} />;
}
