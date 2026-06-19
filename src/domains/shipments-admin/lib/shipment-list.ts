import type {
  DtoAdminShipmentListItem,
  GetAdminShipments200
} from '@/services/-admin-shipments-get.schemas';

export function getShipmentsFromListResponse(
  data: GetAdminShipments200 | undefined
): DtoAdminShipmentListItem[] {
  return data?.data?.shipments ?? [];
}

export function getShipmentsTotalFromListResponse(
  data: GetAdminShipments200 | undefined
): number | undefined {
  return data?.data?.total;
}
