import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type {
  DtoCreateCollectionRequest,
  PostCollections201,
  UtilsResponse
} from './-collections-get.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const postCollections = (data: DtoCreateCollectionRequest, options?: RequestOptions) =>
  customInstance<PostCollections201>({ url: `/collections`, method: 'POST', data }, options);

export const usePostCollections = (
  options?: UseMutationOptions<
    PostCollections201,
    UtilsResponse,
    { data: DtoCreateCollectionRequest }
  >
) =>
  useMutation({
    mutationFn: ({ data }) => postCollections(data),
    ...options
  });
