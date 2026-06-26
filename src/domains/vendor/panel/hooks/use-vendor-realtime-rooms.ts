'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { listVendorStores } from '@/lib/api/vendor-stores';
import type { UserPayload } from '@/lib/auth/auth-server';
import { useRealtime } from '@/lib/realtime/realtime-provider';
import { storeRoomId, vendorUserRoomId } from '@/lib/realtime/vendor-realtime';

/** Joins WebSocket rooms for the vendor's stores and user channel. */
export function useVendorRealtimeRooms(user: UserPayload) {
  const { joinRoom, status } = useRealtime();
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  const { data: storesData } = useQuery({
    queryKey: ['vendor-stores'],
    queryFn: listVendorStores
  });

  const storeIds = storesData?.data?.map((store) => store.id).filter(Boolean) ?? [];

  const storeIdsKey = storeIds.join(',');

  useEffect(() => {
    if (status !== 'connected' || !user.id) return;

    joinRoom(vendorUserRoomId(user.id));

    for (const storeId of storeIds) {
      if (storeId) {
        joinRoom(storeRoomId(storeId));
      }
    }

    if (activeStoreId > 0) {
      joinRoom(storeRoomId(activeStoreId));
    }
  }, [activeStoreId, joinRoom, status, storeIdsKey, user.id]);

  return { status };
}
