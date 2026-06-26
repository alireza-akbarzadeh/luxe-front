'use client';

import { IconArrowLeft, IconBuildingStore } from '@tabler/icons-react';

import { SiteSimpleNotFound } from '@/components/error-state/site-simple-not-found';

export default function OrderNotFound() {
  return (
    <SiteSimpleNotFound
      namespace='errors.orderTracking'
      Icon={IconBuildingStore}
      primaryHref='/shop'
      primaryIcon={IconArrowLeft}
    />
  );
}
