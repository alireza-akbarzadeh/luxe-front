import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMutationOptions, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { customInstance } from '../lib/api/api-client';

import type {
  DtoAdjustInventoryRequest,
  GetAdminInventory200,
  GetAdminInventoryAdjustmentsRecent200,
  GetAdminInventoryAdjustmentsRecentParams,
  GetAdminInventoryOverview200,
  GetAdminInventoryParams,
  GetAdminInventoryProductsIdHistory200,
  GetAdminInventoryProductsIdHistoryParams,
  PostAdminInventoryAdjust200,
  UtilsResponse
} from './-admin-inventory.schemas';

type RequestOptions = Parameters<typeof customInstance>[1];

export const getAdminInventoryOverview = (options?: RequestOptions, signal?: AbortSignal) =>
  customInstance<GetAdminInventoryOverview200>(
    { url: `/admin/inventory/overview`, method: 'GET', signal },
    options
  );

export const getGetAdminInventoryOverviewQueryKey = () => ['/admin/inventory/overview'] as const;

export const useGetAdminInventoryOverview = <
  TData = Awaited<ReturnType<typeof getAdminInventoryOverview>>,
  TError = UtilsResponse
>(options?: {
  query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAdminInventoryOverview>>, TError, TData>>;
  request?: RequestOptions;
}): UseQueryResult<TData, TError> => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  return useQuery({
    queryKey: getGetAdminInventoryOverviewQueryKey(),
    queryFn: ({ signal }) => getAdminInventoryOverview(requestOptions, signal),
    ...queryOptions
  });
};

export const getAdminInventory = (
  params?: GetAdminInventoryParams,
  options?: RequestOptions,
  signal?: AbortSignal
) =>
  customInstance<GetAdminInventory200>(
    { url: `/admin/inventory`, method: 'GET', params, signal },
    options
  );

export const getGetAdminInventoryQueryKey = (params?: GetAdminInventoryParams) =>
  [`/admin/inventory`, ...(params ? [params] : [])] as const;

export const useGetAdminInventory = <
  TData = Awaited<ReturnType<typeof getAdminInventory>>,
  TError = UtilsResponse
>(
  params?: GetAdminInventoryParams,
  options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAdminInventory>>, TError, TData>>;
    request?: RequestOptions;
  }
): UseQueryResult<TData, TError> => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  return useQuery({
    queryKey: getGetAdminInventoryQueryKey(params),
    queryFn: ({ signal }) => getAdminInventory(params, requestOptions, signal),
    ...queryOptions
  });
};

export const postAdminInventoryAdjust = (
  data: DtoAdjustInventoryRequest,
  options?: RequestOptions
) =>
  customInstance<PostAdminInventoryAdjust200>(
    { url: `/admin/inventory/adjust`, method: 'POST', data },
    options
  );

export const usePostAdminInventoryAdjust = (
  options?: UseMutationOptions<
    PostAdminInventoryAdjust200,
    UtilsResponse,
    { data: DtoAdjustInventoryRequest }
  >
) =>
  useMutation({
    mutationFn: ({ data }) => postAdminInventoryAdjust(data),
    ...options
  });

export const getAdminInventoryProductsIdHistory = (
  id: number,
  params?: GetAdminInventoryProductsIdHistoryParams,
  options?: RequestOptions,
  signal?: AbortSignal
) =>
  customInstance<GetAdminInventoryProductsIdHistory200>(
    { url: `/admin/inventory/products/${id}/history`, method: 'GET', params, signal },
    options
  );

export const getGetAdminInventoryProductsIdHistoryQueryKey = (
  id: number,
  params?: GetAdminInventoryProductsIdHistoryParams
) => [`/admin/inventory/products/${id}/history`, ...(params ? [params] : [])] as const;

export const useGetAdminInventoryProductsIdHistory = (
  id: number,
  params?: GetAdminInventoryProductsIdHistoryParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAdminInventoryProductsIdHistory>>,
        UtilsResponse
      >
    >;
    request?: RequestOptions;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  return useQuery({
    queryKey: getGetAdminInventoryProductsIdHistoryQueryKey(id, params),
    queryFn: ({ signal }) => getAdminInventoryProductsIdHistory(id, params, requestOptions, signal),
    enabled: id > 0,
    ...queryOptions
  });
};

export const getAdminInventoryAdjustmentsRecent = (
  params?: GetAdminInventoryAdjustmentsRecentParams,
  options?: RequestOptions,
  signal?: AbortSignal
) =>
  customInstance<GetAdminInventoryAdjustmentsRecent200>(
    { url: `/admin/inventory/adjustments/recent`, method: 'GET', params, signal },
    options
  );

export const getGetAdminInventoryAdjustmentsRecentQueryKey = (
  params?: GetAdminInventoryAdjustmentsRecentParams
) => [`/admin/inventory/adjustments/recent`, ...(params ? [params] : [])] as const;

export const useGetAdminInventoryAdjustmentsRecent = (
  params?: GetAdminInventoryAdjustmentsRecentParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getAdminInventoryAdjustmentsRecent>>,
        UtilsResponse
      >
    >;
    request?: RequestOptions;
  }
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  return useQuery({
    queryKey: getGetAdminInventoryAdjustmentsRecentQueryKey(params),
    queryFn: ({ signal }) => getAdminInventoryAdjustmentsRecent(params, requestOptions, signal),
    ...queryOptions
  });
};
