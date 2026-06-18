import type { DtoAdminOrderListItem, GetOrders200 } from '@/services/-orders-get.schemas';

export function getOrdersFromListResponse(data: GetOrders200 | undefined): DtoAdminOrderListItem[] {
  return data?.data?.orders ?? [];
}

export function getOrdersTotalFromListResponse(data: GetOrders200 | undefined): number | undefined {
  return data?.data?.total;
}
