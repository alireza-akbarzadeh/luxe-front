import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type {
  DtoCreateCollectionRequest,
  PostCollections201,
  UtilsResponse
} from './-collections-post.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const postCollections = (
  data: DtoCreateCollectionRequest,
  options?: RequestOptions,
  signal?: AbortSignal
) =>
  customInstance<PostCollections201>(
    {
      url: `/collections`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data,
      signal
    },
    options
  );

export const usePostCollections = <TError = UtilsResponse, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof postCollections>>,
      TError,
      { data: DtoCreateCollectionRequest },
      TContext
    >;
    request?: RequestOptions;
  },
  queryClient?: Parameters<typeof useMutation>[1]
): UseMutationResult<
  Awaited<ReturnType<typeof postCollections>>,
  TError,
  { data: DtoCreateCollectionRequest },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};
  return useMutation(
    {
      mutationFn: ({ data }) => postCollections(data, requestOptions),
      ...mutationOptions
    },
    queryClient
  );
};
