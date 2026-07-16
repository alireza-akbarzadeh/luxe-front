import type { Metadata } from 'next';
import { Suspense } from 'react';

import { BrandDetailDomain } from '@/domains/brands/containers/brand-detail.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getBrandsSlugSlug } from '@/services/-brands-slug-{slug}-get';

type BrandDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BrandDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getBrandsSlugSlug(slug);
    const brand = response.data;

    if (!brand?.name) {
      return { title: 'Brand Not Found' };
    }

    return buildPageMetadata({
      title: brand.meta_title || brand.name,
      description:
        brand.meta_description ||
        brand.description?.replace(/\s+/g, ' ').trim().slice(0, 160) ||
        `Explore ${brand.name} on Luxe.`,
      path: `/brands/${slug}`,
      image: brand.logo_url
    });
  } catch {
    return { title: 'Brand Not Found' };
  }
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <main className='app-container py-10'>
          <div className='bg-muted/40 h-64 animate-pulse rounded-[1.75rem]' />
        </main>
      }
    >
      <BrandDetailDomain slug={slug} />
    </Suspense>
  );
}
