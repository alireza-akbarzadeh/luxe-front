import { useQuery } from '@tanstack/react-query';
import type {
  DataTag,
  QueryClient,
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type { GetAdminInvoicesId200 } from './-admin-invoices.schemas';

import { customInstance } from '../lib/api/api-client';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getAdminInvoicesId = (
  id: number,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<GetAdminInvoicesId200>(
    { url: `/admin/invoices/${id}`, method: 'GET', signal },
    options
  );
};

export const getGetAdminInvoicesIdQueryKey = (id: number) => {
  return [`/admin/invoices/${id}`] as const;
};

export const getGetAdminInvoicesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getAdminInvoicesId>>,
  TError = unknown
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAdminInvoicesId>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetAdminInvoicesIdQueryKey(id);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAdminInvoicesId>>> = ({ signal }) =>
    getAdminInvoicesId(id, requestOptions, signal);

  return { queryKey, queryFn, enabled: id > 0, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAdminInvoicesId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export function useGetAdminInvoicesId<
  TData = Awaited<ReturnType<typeof getAdminInvoicesId>>,
  TError = unknown
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAdminInvoicesId>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryOptions = getGetAdminInvoicesIdQueryOptions(id, options);
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };
  return { ...query, queryKey: queryOptions.queryKey };
}
