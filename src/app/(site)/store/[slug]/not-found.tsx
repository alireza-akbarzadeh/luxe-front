'use client';

import { IconArrowLeft, IconBuildingStore } from '@tabler/icons-react';

import { SiteSimpleNotFound } from '@/components/error-state/site-simple-not-found';

export default function StoreNotFound() {
  return (
    <SiteSimpleNotFound
      namespace='errors.store'
      Icon={IconBuildingStore}
      primaryHref='/store'
      primaryIcon={IconArrowLeft}
    />
  );
}
