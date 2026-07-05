import type { Metadata } from 'next';

import { CreatorStorefrontDetailDomain } from '@/domains/creator-storefronts/creator-storefront-detail.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

type CreatorDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CreatorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: 'Creator Storefront',
    description: 'Shop a curated edit from a style creator on Luxe.',
    path: `/creators/${slug}`
  });
}

export default async function CreatorDetailPage({ params }: CreatorDetailPageProps) {
  const { slug } = await params;
  return <CreatorStorefrontDetailDomain slug={slug} />;
}
