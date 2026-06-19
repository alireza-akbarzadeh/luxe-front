import { useQuery } from '@tanstack/react-query';
import type {
  DataTag,
  QueryClient,
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type { GetAdminStoresId200, UtilsResponse } from './-admin-stores-{id}-get.schemas';

import { customInstance } from '../lib/api/api-client';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getAdminStoresId = (
  id: number,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<GetAdminStoresId200>(
    { url: `/admin/stores/${id}`, method: 'GET', signal },
    options
  );
};

export const getGetAdminStoresIdQueryKey = (id: number) => {
  return [`/admin/stores/${id}`] as const;
};

export const getGetAdminStoresIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getAdminStoresId>>,
  TError = UtilsResponse
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAdminStoresId>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetAdminStoresIdQueryKey(id);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAdminStoresId>>> = ({ signal }) =>
    getAdminStoresId(id, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAdminStoresId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export function useGetAdminStoresId<
  TData = Awaited<ReturnType<typeof getAdminStoresId>>,
  TError = UtilsResponse
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAdminStoresId>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryOptions = getGetAdminStoresIdQueryOptions(id, options);
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };
  return { ...query, queryKey: queryOptions.queryKey };
}
