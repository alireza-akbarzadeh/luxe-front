import type { QueryClient } from '@tanstack/react-query';

import { getGetAddressesQueryKey } from '@/services/-addresses-get';
import type { GetAddresses200 } from '@/services/-addresses-get.schemas';
import type { ModelsAddress } from '@/services/-addresses-get.schemas';

/** Merges one address into the TanStack Query cache without refetching GET /addresses. */
export function upsertCheckoutAddressCache(queryClient: QueryClient, address: ModelsAddress): void {
  if (address.id == null) return;

  queryClient.setQueryData<GetAddresses200>(getGetAddressesQueryKey(), (current) => {
    const list = current?.data?.addresses ?? [];
    const index = list.findIndex((item) => item.id === address.id);
    const addresses =
      index >= 0 ? list.map((item, i) => (i === index ? address : item)) : [...list, address];

    return {
      ...current,
      success: current?.success ?? true,
      data: { addresses }
    };
  });
}

/** Removes one address from the TanStack Query cache without refetching GET /addresses. */
export function removeCheckoutAddressCache(queryClient: QueryClient, addressId: number): void {
  queryClient.setQueryData<GetAddresses200>(getGetAddressesQueryKey(), (current) => {
    const list = current?.data?.addresses ?? [];

    return {
      ...current,
      success: current?.success ?? true,
      data: { addresses: list.filter((item) => item.id !== addressId) }
    };
  });
}
