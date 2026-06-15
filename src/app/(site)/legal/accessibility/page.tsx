import type { Metadata } from 'next';
import Link from 'next/link';

import { StaticSitePage } from '@/domains/support/components/static-site-page';

export const metadata: Metadata = {
  title: 'Accessibility — Luxe Marketplace',
  description: 'Luxe Marketplace accessibility statement and support options.'
};

export default function AccessibilityPage() {
  return (
    <StaticSitePage
      eyebrow='Legal'
      title='Accessibility statement'
      description='Our commitment to an inclusive shopping experience'
      breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Accessibility' }]}
    >
      <h2>Our commitment</h2>
      <p>
        Luxe aims to provide a shopping experience that is accessible to people with diverse
        abilities. We continually improve keyboard navigation, color contrast, semantic structure,
        and screen reader compatibility across the storefront.
      </p>

      <h2>Standards</h2>
      <p>
        We target conformance with WCAG 2.1 Level AA guidelines. Some third-party content or legacy
        components may not yet fully meet this standard.
      </p>

      <h2>Feedback</h2>
      <p>
        If you encounter a barrier while using our site, please contact us with the page URL and a
        description of the issue. We respond to accessibility feedback within two business days.
      </p>

      <p>
        Email{' '}
        <Link
          href='mailto:accessibility@luxe.com'
          className='text-accent underline-offset-4 hover:underline'
        >
          accessibility@luxe.com
        </Link>{' '}
        or use our{' '}
        <Link href='/contact' className='text-accent underline-offset-4 hover:underline'>
          contact form
        </Link>
        .
      </p>
    </StaticSitePage>
  );
}
