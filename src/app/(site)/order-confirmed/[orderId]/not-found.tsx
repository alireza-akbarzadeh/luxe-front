'use client';

import { IconShoppingBag } from '@tabler/icons-react';

import { SiteSimpleNotFound } from '@/components/error-state/site-simple-not-found';

export default function OrderConfirmedNotFound() {
  return (
    <SiteSimpleNotFound
      namespace='errors.orderConfirmed'
      Icon={IconShoppingBag}
      primaryHref='/shop'
      primaryIcon={IconShoppingBag}
      compact
    />
  );
}
