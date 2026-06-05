'use client';

import { AdminErrorState } from '@/components/cart/admin-error-state';

export default function Forbidden() {
  return (
    <AdminErrorState
      code='403'
      badge='Insufficient permissions'
      tone='danger'
      title="You don't have access to this section"
      description="Your role doesn't include the permissions required for this admin resource. Ask an owner to grant access or switch to an account with the correct scopes."
      primary={{ label: 'Request access', href: '#' }}
      secondary={{ label: 'Back to dashboard', href: '/admin' }}
      meta={[
        { label: 'Required role', value: 'owner' },
        { label: 'Your role', value: 'staff' },
        { label: 'Scope', value: 'orders:write' }
      ]}
    />
  );
}
