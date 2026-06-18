import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type {
  DtoCollectionListResponse,
  GetCollectionsParams,
  UtilsResponse
} from './-collections-get.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const getCollections = (
  params?: GetCollectionsParams,
  options?: RequestOptions,
  signal?: AbortSignal
) =>
  customInstance<DtoCollectionListResponse>(
    { url: `/collections`, method: 'GET', params, signal },
    options
  );

export const getGetCollectionsQueryKey = (params?: GetCollectionsParams) =>
  [`/collections`, ...(params ? [params] : [])] as const;

export const useGetCollections = <
  TData = Awaited<ReturnType<typeof getCollections>>,
  TError = UtilsResponse
>(
  params?: GetCollectionsParams,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCollections>>, TError, TData>>;
    request?: RequestOptions;
  }
): UseQueryResult<TData, TError> => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  return useQuery({
    queryKey: getGetCollectionsQueryKey(params),
    queryFn: ({ signal }) => getCollections(params, requestOptions, signal),
    ...queryOptions
  });
};
