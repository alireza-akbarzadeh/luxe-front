import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type {
  DtoUpdateCollectionRequest,
  PutCollectionsId200,
  UtilsResponse
} from './-collections-{id}-put.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const putCollectionsId = (
  id: number,
  data: DtoUpdateCollectionRequest,
  options?: RequestOptions,
  signal?: AbortSignal
) =>
  customInstance<PutCollectionsId200>(
    {
      url: `/collections/${id}`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      data,
      signal
    },
    options
  );

export const usePutCollectionsId = <TError = UtilsResponse, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof putCollectionsId>>,
      TError,
      { id: number; data: DtoUpdateCollectionRequest },
      TContext
    >;
    request?: RequestOptions;
  },
  queryClient?: Parameters<typeof useMutation>[1]
): UseMutationResult<
  Awaited<ReturnType<typeof putCollectionsId>>,
  TError,
  { id: number; data: DtoUpdateCollectionRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};
  return useMutation(
    {
      mutationFn: ({ id, data }) => putCollectionsId(id, data, requestOptions),
      ...mutationOptions
    },
    queryClient
  );
};
