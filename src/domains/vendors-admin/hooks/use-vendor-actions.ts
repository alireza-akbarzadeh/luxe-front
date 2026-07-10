import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { putAdminStoresId } from '@/services/-admin-stores-{id}-put';
import { getGetAdminStoresQueryKey } from '@/services/-admin-stores-get';
import { getGetAdminVendorsKpisQueryKey } from '@/services/-admin-vendors-kpis-get';

/** Admin mutations for vendor approval, verification, and suspension. */
export function useVendorActions() {
  const queryClient = useQueryClient();

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminStoresQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminVendorsKpisQueryKey() });
  }, [queryClient]);

  const updateStore = useCallback(
    async (id: number, payload: { status?: string; is_verified?: boolean }, successMessage: string) => {
      try {
        await putAdminStoresId(id, payload);
        invalidate();
        toast.success(successMessage);
      } catch (error) {
        toast.error('Action failed', {
          description: error instanceof Error ? error.message : undefined
        });
        throw error;
      }
    },
    [invalidate]
  );

  return {
    approve: (id: number) => updateStore(id, { status: 'active' }, 'Vendor approved'),
    reject: (id: number) => updateStore(id, { status: 'suspended' }, 'Application rejected'),
    suspend: (id: number) => updateStore(id, { status: 'suspended' }, 'Vendor suspended'),
    verify: (id: number) => updateStore(id, { is_verified: true }, 'Vendor verified'),
    unverify: (id: number) => updateStore(id, { is_verified: false }, 'Verification removed')
  };
}
