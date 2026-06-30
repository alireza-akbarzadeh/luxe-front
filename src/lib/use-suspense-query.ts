// lib/query/use-suspense-query.ts
import type { QueryFunction } from '@tanstack/react-query';
import { type UseQueryOptions } from '@tanstack/react-query';

export function toSuspenseOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends readonly unknown[]
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  return {
    ...options,
    queryFn: options.queryFn as QueryFunction<TQueryFnData, TQueryKey>
  };
}
