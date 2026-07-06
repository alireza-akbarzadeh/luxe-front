import type { Metadata } from 'next';

import { ReverseMarketplaceDetailDomain } from '@/domains/reverse-marketplace/reverse-marketplace-detail.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

interface ReverseMarketplaceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReverseMarketplaceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return buildPageMetadata({
    title: 'Wanted Listing',
    description: 'View buyer request details and vendor offers on the Luxe reverse marketplace.',
    path: `/reverse-marketplace/${id}`
  });
}

export default async function ReverseMarketplaceDetailPage({ params }: ReverseMarketplaceDetailPageProps) {
  const { id } = await params;
  const requestId = Number(id);

  return <ReverseMarketplaceDetailDomain requestId={requestId} />;
}
