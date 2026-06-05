'use client';

import { AdminErrorState } from '@/components/cart/admin-error-state';

export default function CatchAllPath() {
  return (
    <AdminErrorState
      code='405'
      badge='Resource not found'
      tone='warn'
      title="We couldn't find that admin page"
      description="The page you're trying to open doesn't exist, was moved, or the resource ID is invalid. Check the URL or jump back to the dashboard."
      primary={{ label: 'Back to dashboard', href: '/dashboard' }}
      secondary={{ label: 'Storefront', href: '/' }}
    />
  );
}
