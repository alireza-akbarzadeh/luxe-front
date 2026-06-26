import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SearchPageSkeleton } from '@/domains/search/components/search-page-skeleton';
import SearchDomain from '@/domains/search/search.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  if (query) {
    return {
      title: `Search results for “${query}”`,
      robots: { index: false, follow: true }
    };
  }

  return buildPageMetadata({
    title: 'Search',
    description: 'Search the Luxe catalog for fashion, accessories, brands, and more.',
    path: '/search'
  });
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchDomain />
    </Suspense>
  );
}
