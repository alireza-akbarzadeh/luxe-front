import type { GetAdminInventory200 } from '@/services/-admin-inventory.schemas';

export function getInventoryItemsFromListResponse(data: GetAdminInventory200 | undefined) {
  return data?.data?.items ?? [];
}

export function getInventoryTotalFromListResponse(data: GetAdminInventory200 | undefined) {
  return data?.data?.total ?? 0;
}
