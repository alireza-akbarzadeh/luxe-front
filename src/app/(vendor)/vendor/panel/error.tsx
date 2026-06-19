'use client';

import { AdminErrorState } from '@/components/cart/admin-error-state';

export default function VendorPanelError() {
  return (
    <AdminErrorState
      code='500'
      badge='Vendor panel'
      tone='danger'
      title='Something went wrong'
      description='We could not load this vendor section. Try again or return to your overview.'
      primary={{ label: 'Vendor overview', href: '/vendor/panel' }}
      secondary={{ label: 'Vendor home', href: '/vendor' }}
    />
  );
}
