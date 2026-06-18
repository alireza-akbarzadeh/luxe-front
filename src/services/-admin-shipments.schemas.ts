export type { UtilsResponse, GetAdminShipmentsParams } from './-admin-shipments-get.schemas';

export type { DtoStateView } from './-admin-returns-{id}-get.schemas';

import type { UtilsResponse } from './-admin-shipments-get.schemas';
import type { DtoStateView } from './-admin-returns-{id}-get.schemas';

export interface DtoAdminShipmentListItem {
  id?: number;
  order_id?: number;
  order_number?: string;
  carrier?: string;
  tracking_number?: string;
  status?: string;
  customer_name?: string;
  city?: string;
  country?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  created_at?: string;
  state?: DtoStateView;
}

export interface DtoAdminShipmentListData {
  limit?: number;
  offset?: number;
  shipments?: DtoAdminShipmentListItem[];
  total?: number;
}

export type GetAdminShipments200 = UtilsResponse & {
  data?: DtoAdminShipmentListData;
};
