import type { Metadata } from 'next';
import Link from 'next/link';

import { StaticSitePage } from '@/domains/support/components/static-site-page';

export const metadata: Metadata = {
  title: 'Terms of Service — Luxe Marketplace',
  description: 'Terms and conditions for using Luxe Marketplace.'
};

export default function TermsOfServicePage() {
  return (
    <StaticSitePage
      eyebrow='Legal'
      title='Terms of service'
      description='Last updated: June 2026'
      breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Terms of Service' }]}
    >
      <h2>Agreement</h2>
      <p>
        By accessing or using Luxe Marketplace, you agree to these Terms of Service. If you do not
        agree, please do not use the site.
      </p>

      <h2>Accounts</h2>
      <p>
        You must provide accurate information when creating an account and keep your credentials
        secure. You are responsible for activity under your account. Purchases require a signed-in
        account.
      </p>

      <h2>Marketplace transactions</h2>
      <p>
        Luxe connects buyers with independent vendors. Product descriptions, pricing, shipping,
        and return policies may vary by seller. Orders are subject to vendor availability and
        applicable taxes.
      </p>

      <h2>Prohibited conduct</h2>
      <ul>
        <li>Fraudulent orders or payment abuse.</li>
        <li>Scraping, reverse engineering, or interfering with platform security.</li>
        <li>Posting unlawful, misleading, or infringing content in reviews or Q&amp;A.</li>
      </ul>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Luxe is not liable for indirect or consequential
        damages arising from use of the platform. Our aggregate liability is limited to amounts paid
        for the order giving rise to the claim.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{' '}
        <Link href='mailto:legal@luxe.com' className='text-accent underline-offset-4 hover:underline'>
          legal@luxe.com
        </Link>{' '}
        or visit our{' '}
        <Link href='/contact' className='text-accent underline-offset-4 hover:underline'>
          contact page
        </Link>
        .
      </p>
    </StaticSitePage>
  );
}
