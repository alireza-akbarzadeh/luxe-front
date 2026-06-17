import type { Metadata } from 'next';

import { SiteErrorState } from '@/components/error-state/site-error-state';
import { BaseLayout } from '@/components/layouts/base-layout';

export const metadata: Metadata = {
  title: 'Access Denied — Luxe Marketplace',
  description:
    'You are signed in, but your account does not have permission to access the admin dashboard.'
};

export default function UnauthorizedPage() {
  return (
    <BaseLayout>
      <SiteErrorState
        code='403'
        eyebrow='Access restricted'
        title="You don't have permission to view this area"
        description="You're signed in, but your account doesn't include admin access. If you need dashboard permissions, contact your store administrator."
        primary={{
          label: 'Go to my account',
          href: '/account'
        }}
        secondary={{
          label: 'Continue shopping',
          href: '/'
        }}
        accent='from-amber-200/60 via-orange-200/40 to-rose-200/50'
      />
    </BaseLayout>
  );
}
