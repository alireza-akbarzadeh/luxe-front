import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type {
  GetCollections200,
  GetCollectionsParams,
  UtilsResponse
} from './-collections-get.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const getCollections = (
  params?: GetCollectionsParams,
  options?: RequestOptions,
  signal?: AbortSignal
) =>
  customInstance<GetCollections200>({ url: `/collections`, method: 'GET', params, signal }, options);

export const getGetCollectionsQueryKey = (params?: GetCollectionsParams) =>
  ['/collections', ...(params ? [params] : [])] as const;

export const useGetCollections = <TData = GetCollections200, TError = UtilsResponse>(
  params?: GetCollectionsParams,
  options?: { query?: Partial<UseQueryOptions<GetCollections200, TError, TData>> }
): UseQueryResult<TData, TError> =>
  useQuery({
    queryKey: getGetCollectionsQueryKey(params),
    queryFn: ({ signal }) => getCollections(params, undefined, signal),
    ...options?.query
  });
