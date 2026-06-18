import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type { GetCollectionsId200, UtilsResponse } from './-collections-{id}-get.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const getCollectionsId = (id: number, options?: RequestOptions, signal?: AbortSignal) =>
  customInstance<GetCollectionsId200>({ url: `/collections/${id}`, method: 'GET', signal }, options);

export const getGetCollectionsIdQueryKey = (id: number) => [`/collections/${id}`] as const;

export const useGetCollectionsId = <
  TData = Awaited<ReturnType<typeof getCollectionsId>>,
  TError = UtilsResponse
>(
  id: number,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCollectionsId>>, TError, TData>>;
    request?: RequestOptions;
  }
): UseQueryResult<TData, TError> => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  return useQuery({
    queryKey: getGetCollectionsIdQueryKey(id),
    queryFn: ({ signal }) => getCollectionsId(id, requestOptions, signal),
    enabled: id > 0,
    ...queryOptions
  });
};
