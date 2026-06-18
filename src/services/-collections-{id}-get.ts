import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type { GetCollectionsId200, UtilsResponse } from './-collections-{id}-get.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const getCollectionsId = (id: number, options?: RequestOptions, signal?: AbortSignal) =>
  customInstance<GetCollectionsId200>({ url: `/collections/${id}`, method: 'GET', signal }, options);

export const getGetCollectionsIdQueryKey = (id: number) => [`/collections/${id}`] as const;

export const useGetCollectionsId = <TData = GetCollectionsId200, TError = UtilsResponse>(
  id: number,
  options?: { query?: Partial<UseQueryOptions<GetCollectionsId200, TError, TData>> }
): UseQueryResult<TData, TError> =>
  useQuery({
    queryKey: getGetCollectionsIdQueryKey(id),
    queryFn: ({ signal }) => getCollectionsId(id, undefined, signal),
    enabled: id > 0,
    ...options?.query
  });
