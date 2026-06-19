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
  DtoAdminRevenueReportApiResponse,
  GetAdminReportsRevenueParams
} from './-admin-reports-revenue-get.schemas';

import { customInstance } from '../lib/api/api-client';

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getAdminReportsRevenue = (
  params?: GetAdminReportsRevenueParams,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<DtoAdminRevenueReportApiResponse>(
    { url: `/admin/reports/revenue`, method: 'GET', params, signal },
    options
  );
};

export const getGetAdminReportsRevenueQueryKey = (params?: GetAdminReportsRevenueParams) => {
  return [`/admin/reports/revenue`, ...(params ? [params] : [])] as const;
};

export const getGetAdminReportsRevenueQueryOptions = <
  TData = Awaited<ReturnType<typeof getAdminReportsRevenue>>,
  TError = unknown
>(
  params?: GetAdminReportsRevenueParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getAdminReportsRevenue>>, TError, TData>
    >;
    request?: SecondParameter<typeof customInstance>;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetAdminReportsRevenueQueryKey(params);
  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAdminReportsRevenue>>> = ({ signal }) =>
    getAdminReportsRevenue(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAdminReportsRevenue>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData, TError> };
};

export function useGetAdminReportsRevenue<
  TData = Awaited<ReturnType<typeof getAdminReportsRevenue>>,
  TError = unknown
>(
  params?: GetAdminReportsRevenueParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getAdminReportsRevenue>>, TError, TData>
    >;
    request?: SecondParameter<typeof customInstance>;
  },
  queryClient?: QueryClient
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
  const queryOptions = getGetAdminReportsRevenueQueryOptions(params, options);
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };
  return { ...query, queryKey: queryOptions.queryKey };
}
