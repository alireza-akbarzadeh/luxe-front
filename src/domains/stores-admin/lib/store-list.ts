import type { DtoStoreResponse, GetStores200 } from '@/services/-stores-get.schemas';

export function getStoresFromListResponse(data: GetStores200 | undefined): DtoStoreResponse[] {
  return data?.data?.stores ?? [];
}

export function getStoresTotalFromListResponse(data: GetStores200 | undefined): number {
  return data?.data?.total ?? 0;
}
