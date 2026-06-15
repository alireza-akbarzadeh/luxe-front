import type { Metadata } from 'next';
import Link from 'next/link';

import { StaticSitePage } from '@/domains/support/components/static-site-page';

export const metadata: Metadata = {
  title: 'Privacy Policy — Luxe Marketplace',
  description: 'How Luxe Marketplace collects, uses, and protects your personal information.'
};

export default function PrivacyPolicyPage() {
  return (
    <StaticSitePage
      eyebrow='Legal'
      title='Privacy policy'
      description='Last updated: June 2026'
      breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Privacy Policy' }]}
    >
      <h2>Overview</h2>
      <p>
        Luxe Marketplace (&quot;Luxe&quot;, &quot;we&quot;, &quot;us&quot;) respects your privacy.
        This policy explains what information we collect when you use our website, how we use it,
        and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Account details such as name, email address, and password hash when you register.</li>
        <li>Order, shipping, and payment information needed to fulfill purchases.</li>
        <li>Usage data such as pages viewed, device type, and approximate location from logs.</li>
        <li>Communications you send to support or through contact forms.</li>
      </ul>

      <h2>How we use information</h2>
      <p>
        We use your information to operate the marketplace, process orders, provide customer
        support, improve our services, prevent fraud, and — with your consent — send marketing
        communications.
      </p>

      <h2>Sharing</h2>
      <p>
        We share order fulfillment data with vendors and payment/shipping partners as needed to
        complete transactions. We do not sell your personal information to third parties.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on your location, you may request access, correction, or deletion of your
        personal data. Contact{' '}
        <Link href='mailto:privacy@luxe.com' className='text-accent underline-offset-4 hover:underline'>
          privacy@luxe.com
        </Link>{' '}
        for privacy requests.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies and similar technologies for authentication, preferences, and analytics. See
        our{' '}
        <Link href='/legal/cookies' className='text-accent underline-offset-4 hover:underline'>
          cookie policy
        </Link>{' '}
        for details.
      </p>
    </StaticSitePage>
  );
}
