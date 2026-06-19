import { useQuery } from '@tanstack/react-query';
import type {
  DataTag,
  QueryClient,
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  GetPaymentsStripeConfig200,
  UtilsResponse
} from './-payments-stripe-config-get.schemas';

import { customInstance } from '../lib/api/api-client';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getPaymentsStripeConfig = (
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<GetPaymentsStripeConfig200>(
    { url: `/payments/stripe-config`, method: 'GET', signal },
    options
  );
};

export const getGetPaymentsStripeConfigQueryKey = () => {
  return [`/payments/stripe-config`] as const;
};

export function useGetPaymentsStripeConfig<
  TData = Awaited<ReturnType<typeof getPaymentsStripeConfig>>,
  TError = UtilsResponse
>(
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getPaymentsStripeConfig>>, TError, TData>
    >;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryKey = options?.query?.queryKey ?? getGetPaymentsStripeConfigQueryKey();
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPaymentsStripeConfig>>> = ({
    signal
  }) => getPaymentsStripeConfig(options?.request, signal);

  const query = useQuery({ queryKey, queryFn, ...options?.query }, queryClient) as UseQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey };
}
