// app/page.tsx
import type { Metadata } from 'next';

import { SiteJsonLd } from '@/components/seo/site-json-ld';
import { HomeDomains } from '@/domains/home/home.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Premium Fashion & Lifestyle',
  description:
    'Shop curated luxury fashion, accessories, and lifestyle products at Luxe. Premium brands, fast shipping, easy returns, and exceptional service.',
  path: '/',
  keywords:
    'luxe, luxury fashion, premium ecommerce, designer clothing, luxury accessories, lifestyle products'
});

export default async function HomePage() {
  return (
    <>
      <SiteJsonLd />
      <HomeDomains />
    </>
  );
}
