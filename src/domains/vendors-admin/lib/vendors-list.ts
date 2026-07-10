import type { GetAdminStores200 } from '@/services/-admin-stores-get.schemas';
import type { DtoAdminStoreResponse } from '@/services/-admin-stores-get.schemas';

export function getVendorsFromListResponse(data: GetAdminStores200 | undefined): DtoAdminStoreResponse[] {
  return data?.data?.stores ?? [];
}

export function getVendorsTotalFromListResponse(data: GetAdminStores200 | undefined): number {
  return data?.data?.total ?? 0;
}
