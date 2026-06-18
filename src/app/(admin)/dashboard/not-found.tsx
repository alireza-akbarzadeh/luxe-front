'use client';

import { AdminErrorState } from '@/components/cart/admin-error-state';

export default function DashboardNotFound() {
  return (
    <AdminErrorState
      code='404'
      badge='Route not found'
      tone='warn'
      title="This dashboard page doesn't exist"
      description="The admin route you're looking for isn't registered in this workspace. It may have been renamed, removed, or the URL contains a typo."
      primary={{ label: 'Back to dashboard', href: '/dashboard' }}
      secondary={{ label: 'View orders', href: '/dashboard/orders' }}
    />
  );
}
