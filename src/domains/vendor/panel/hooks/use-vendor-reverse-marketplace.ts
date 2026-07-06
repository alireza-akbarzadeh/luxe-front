import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import {
  type CreateReverseMarketplaceOfferPayload,
  createVendorReverseMarketplaceOffer,
  listVendorReverseMarketplaceRequests
} from '@/lib/api/reverse-marketplace';

/** Open buyer requests for the active vendor store to respond to. */
export function useVendorReverseMarketplaceRequestsQuery(limit = 12) {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-reverse-marketplace-requests', activeStoreId, limit],
    queryFn: () => listVendorReverseMarketplaceRequests(activeStoreId, limit),
    enabled: activeStoreId > 0,
    staleTime: 60_000
  });
}

/** Submits a vendor offer on a buyer request. */
export function useCreateVendorReverseMarketplaceOfferMutation() {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload
    }: {
      requestId: number;
      payload: CreateReverseMarketplaceOfferPayload;
    }) => createVendorReverseMarketplaceOffer(activeStoreId, requestId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['vendor-reverse-marketplace-requests', activeStoreId]
      });
    }
  });
}
