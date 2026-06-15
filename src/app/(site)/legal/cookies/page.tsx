import type { Metadata } from 'next';
import Link from 'next/link';

import { StaticSitePage } from '@/domains/support/components/static-site-page';

export const metadata: Metadata = {
  title: 'Cookie Policy — Luxe Marketplace',
  description: 'How Luxe Marketplace uses cookies and similar technologies.'
};

export default function CookiePolicyPage() {
  return (
    <StaticSitePage
      eyebrow='Legal'
      title='Cookie policy'
      description='Last updated: June 2026'
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Legal', href: '/legal/privacy' },
        { name: 'Cookies' }
      ]}
    >
      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. We use them to keep you signed in,
        remember preferences, and understand how the site is used.
      </p>

      <h2>Types we use</h2>
      <ul>
        <li>
          <strong>Essential</strong> — required for authentication, cart, and checkout.
        </li>
        <li>
          <strong>Functional</strong> — remember settings such as theme or locale.
        </li>
        <li>
          <strong>Analytics</strong> — help us measure traffic and improve performance.
        </li>
      </ul>

      <h2>Managing cookies</h2>
      <p>
        You can control cookies through your browser settings. Disabling essential cookies may
        prevent sign-in and checkout from working correctly.
      </p>

      <p>
        See also our{' '}
        <Link href='/legal/privacy' className='text-accent underline-offset-4 hover:underline'>
          privacy policy
        </Link>
        .
      </p>
    </StaticSitePage>
  );
}
