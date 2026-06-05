import type { Metadata } from 'next';

import { SiteErrorState } from '@/components/error-state/site-error-state';
import { BaseLayout } from '@/components/layouts/base-layout';

export const metadata: Metadata = {
  title: 'Page Not Found — Luxe Marketplace',
  description:
    "The page you're looking for doesn't exist or may have been moved. Explore our latest collections, best sellers, and new arrivals."
};

export default function NotFound() {
  return (
    <BaseLayout>
      <SiteErrorState
        code='404'
        eyebrow='Lost your way?'
        title='This page could not be found'
        description='The destination you requested is no longer available. Discover new arrivals, curated collections, and products selected just for you.'
        primary={{
          label: 'Explore collections',
          href: '/'
        }}
        secondary={{
          label: 'View best sellers',
          href: '/best-sellers'
        }}
        accent='from-sky-200/60 via-indigo-200/40 to-rose-200/50'
      />
    </BaseLayout>
  );
}
