import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type { DtoUpdateCollectionRequest } from './-collections-{id}-put.schemas';
import type { PutCollectionsId200, UtilsResponse } from './-collections-get.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const putCollectionsId = (
  id: number,
  data: DtoUpdateCollectionRequest,
  options?: RequestOptions
) =>
  customInstance<PutCollectionsId200>({ url: `/collections/${id}`, method: 'PUT', data }, options);

export const usePutCollectionsId = (
  options?: UseMutationOptions<
    PutCollectionsId200,
    UtilsResponse,
    { id: number; data: DtoUpdateCollectionRequest }
  >
) =>
  useMutation({
    mutationFn: ({ id, data }) => putCollectionsId(id, data),
    ...options
  });
