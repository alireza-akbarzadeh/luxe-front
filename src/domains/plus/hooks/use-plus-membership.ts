import { useQueryClient } from '@tanstack/react-query';

import { AUTH_USER_QUERY_KEY, useAuth } from '@/components/providers/auth-provider';
import { getGetAccountSummaryQueryKey } from '@/services/-account-summary-get';
import { getGetPlusBenefitsQueryKey, useGetPlusBenefits } from '@/services/-plus-benefits-get';
import {
  getGetPlusMembershipQueryKey,
  useGetPlusMembership
} from '@/services/-plus-membership-get';
import { usePostPlusSubscribe } from '@/services/-plus-subscribe-post';
import { getGetWalletQueryKey } from '@/services/-wallet-get';

/** Public Luxe Plus benefits catalog (landing page). */
export function usePlusBenefitsQuery() {
  return useGetPlusBenefits({ query: { staleTime: 60_000 } });
}

/** Authenticated user's Luxe Plus status. */
export function usePlusMembershipQuery() {
  const { isAuthenticated } = useAuth();

  return useGetPlusMembership({
    query: { enabled: isAuthenticated, staleTime: 30_000 }
  });
}

export function useSubscribeToPlusMutation() {
  const queryClient = useQueryClient();

  return usePostPlusSubscribe({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetPlusMembershipQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getGetPlusBenefitsQueryKey() });
        await queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
        await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
      }
    }
  });
}
