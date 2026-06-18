import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type { UtilsResponse } from './-collections-{id}-delete.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const deleteCollectionsId = (id: number, options?: RequestOptions, signal?: AbortSignal) =>
  customInstance<UtilsResponse>({ url: `/collections/${id}`, method: 'DELETE', signal }, options);

export const useDeleteCollectionsId = <TError = UtilsResponse, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof deleteCollectionsId>>,
      TError,
      { id: number },
      TContext
    >;
    request?: RequestOptions;
  },
  queryClient?: Parameters<typeof useMutation>[1]
): UseMutationResult<
  Awaited<ReturnType<typeof deleteCollectionsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};
  return useMutation(
    {
      mutationFn: ({ id }) => deleteCollectionsId(id, requestOptions),
      ...mutationOptions
    },
    queryClient
  );
};
