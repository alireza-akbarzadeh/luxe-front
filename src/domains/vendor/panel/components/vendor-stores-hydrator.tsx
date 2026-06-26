'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { listVendorStores } from '@/lib/api/vendor-stores';

/** Syncs vendor panel shell with the seller's stores from the API. */
export function VendorStoresHydrator() {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);
  const setActiveStore = useVendorPanelStore((s) => s.setActiveStore);

  const { data } = useQuery({
    queryKey: ['vendor-stores'],
    queryFn: listVendorStores
  });

  const stores = data?.data ?? [];

  useEffect(() => {
    if (stores.length === 0) return;

    const current = stores.find((s) => s.id === activeStoreId);
    if (current) {
      setActiveStore({ id: current.id, name: current.name, slug: current.slug });
      return;
    }

    const first = stores[0];
    if (!first) return;
    setActiveStore({ id: first.id, name: first.name, slug: first.slug });
  }, [activeStoreId, setActiveStore, stores]);

  return null;
}
