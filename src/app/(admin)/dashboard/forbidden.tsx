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
      primary={{ label: 'Back to dashboard', href: '/dashboard' }}
      secondary={{ label: 'Go to storefront', href: '/' }}
      meta={[
        { label: 'Required role', value: 'admin' },
        { label: 'Access level', value: 'restricted' },
        { label: 'Scope', value: 'dashboard:write' }
      ]}
    />
  );
}
