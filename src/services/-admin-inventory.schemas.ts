export interface DtoStateView {
  code?: string;
  color?: string;
  id?: number;
  is_final?: boolean;
  is_initial?: boolean;
  name?: string;
  sort_order?: number;
  text_color?: string;
}

export interface DtoInventoryOverviewResponse {
  low_stock_count?: number;
  out_of_stock_count?: number;
  not_tracked_count?: number;
  tracked_sku_count?: number;
  total_units_on_hand?: number;
  waitlist_total?: number;
}

export interface DtoInventoryItemResponse {
  id?: number;
  name?: string;
  sku?: string;
  slug?: string;
  image_url?: string;
  stock?: number;
  low_stock_threshold?: number;
  track_inventory?: boolean;
  allow_backorder?: boolean;
  warehouse_location?: string;
  status?: string;
  workflow_state?: DtoStateView;
  waitlist_count?: number;
  units_sold_30d?: number;
  stock_status?: string;
  updated_at?: string;
}

export interface DtoInventoryListData {
  items?: DtoInventoryItemResponse[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface DtoInventoryAdjustmentResponse {
  id?: number;
  product_id?: number;
  product_name?: string;
  product_sku?: string;
  quantity_delta?: number;
  quantity_before?: number;
  quantity_after?: number;
  adjustment_type?: string;
  reference_type?: string;
  reference_id?: number;
  actor_name?: string;
  note?: string;
  created_at?: string;
}

export interface DtoInventoryHistoryData {
  adjustments?: DtoInventoryAdjustmentResponse[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface DtoAdjustInventoryRequest {
  product_id: number;
  delta: number;
  reason: 'receive' | 'correction' | 'damage' | 'shrinkage' | 'cycle_count' | 'other';
  note?: string;
}

export interface UtilsResponse {
  code?: number;
  error?: string;
  message?: string;
  success?: boolean;
}

export type InventoryStockStatus =
  | 'all'
  | 'low'
  | 'out'
  | 'healthy'
  | 'not_tracked';

export type GetAdminInventoryParams = {
  page?: number;
  limit?: number;
  search?: string;
  stock_status?: InventoryStockStatus;
  sort?: 'stock_asc' | 'stock_desc' | 'name_asc' | 'waitlist_desc' | 'velocity_desc';
};

export type GetAdminInventory200 = UtilsResponse & {
  data?: DtoInventoryListData;
};

export type GetAdminInventoryOverview200 = UtilsResponse & {
  data?: DtoInventoryOverviewResponse;
};

export type PostAdminInventoryAdjust200 = UtilsResponse & {
  data?: DtoInventoryItemResponse;
};

export type GetAdminInventoryProductsIdHistoryParams = {
  page?: number;
  limit?: number;
};

export type GetAdminInventoryProductsIdHistory200 = UtilsResponse & {
  data?: DtoInventoryHistoryData;
};

export type GetAdminInventoryAdjustmentsRecentParams = {
  limit?: number;
};

export type GetAdminInventoryAdjustmentsRecent200 = UtilsResponse & {
  data?: DtoInventoryAdjustmentResponse[];
};
