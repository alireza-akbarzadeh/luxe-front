import type { Metadata } from 'next';
import { Suspense } from 'react';

import { BrandsDirectoryDomain } from '@/domains/brands/containers/brands-directory.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Brands',
  description: 'Discover and shop from 200+ premium brands on Luxe.',
  path: '/brands'
});

export default function BrandsPage() {
  return (
    <Suspense
      fallback={
        <main className='app-container py-16'>
          <div className='bg-muted/40 h-10 w-48 animate-pulse rounded-lg' />
          <div className='bg-muted/40 mt-6 h-64 animate-pulse rounded-[1.75rem]' />
        </main>
      }
    >
      <BrandsDirectoryDomain />
    </Suspense>
  );
}
