import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/metadata';

/** Organization + WebSite structured data for the storefront home page. */
export function SiteJsonLd() {
  const payload = [organizationJsonLd(), websiteJsonLd()];

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
