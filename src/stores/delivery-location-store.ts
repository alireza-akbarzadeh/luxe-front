'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { GeocodedAddress } from '@/lib/geocoding/types';

interface DeliveryLocationState {
  location: GeocodedAddress | null;
}

interface DeliveryLocationActions {
  setLocation: (location: GeocodedAddress | null) => void;
  reset: () => void;
}

type DeliveryLocationStore = DeliveryLocationState & DeliveryLocationActions;

/** Client-only delivery/shipping location picked from the site navbar map dialog. */
export const useDeliveryLocationStore = create<DeliveryLocationStore>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
      reset: () => set({ location: null })
    }),
    {
      name: 'luxe-delivery-location',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ location: state.location })
    }
  )
);
