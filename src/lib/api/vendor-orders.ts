import { customInstance } from '@/lib/api/api-client';

export interface VendorOrderListItem {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  total_amount: number;
  store_subtotal: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  items_count: number;
  store_items_count: number;
  tracking_number?: string;
  carrier?: string;
  created_at: string;
}

export interface VendorOrdersListParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface VendorOrdersListResponse {
  data?: {
    x: unknown;
    orders?: VendorOrderListItem[];
    total?: number;
    limit?: number;
    offset?: number;
  };
}

export interface VendorOrderStatsResponse {
  data?: {
    total?: number;
    by_status?: Record<string, number>;
  };
}

export interface VendorOrderDetailResponse {
  data?: VendorOrderListItem & {
    store_subtotal?: number;
    store_items_count?: number;
    items?: Array<{
      id: number;
      product_id: number;
      name: string;
      sku?: string;
      image?: string;
      quantity: number;
      unit_price: number;
      total_price: number;
      category?: string;
    }>;
    notes?: string;
    tracking_number?: string;
    carrier?: string;
    updated_at?: string;
  };
}

function toIsoStart(date: string) {
  return new Date(`${date}T00:00:00`).toISOString();
}

function toIsoEnd(date: string) {
  return new Date(`${date}T23:59:59.999`).toISOString();
}

/** List orders for a vendor-owned store with filters. */
export async function listVendorStoreOrders(storeId: number, params: VendorOrdersListParams) {
  const query: Record<string, string | number | undefined> = {
    limit: params.limit,
    offset: params.offset,
    search: params.search,
    status: params.status,
    min_amount: params.min_amount,
    max_amount: params.max_amount
  };

  if (params.from_date) {
    query['from_date'] = toIsoStart(params.from_date);
  }
  if (params.to_date) {
    query['to_date'] = toIsoEnd(params.to_date);
  }

  return customInstance<VendorOrdersListResponse>({
    url: `/vendor/stores/${storeId}/orders`,
    method: 'GET',
    params: query
  });
}

/** Order count summaries for vendor dashboard KPI cards. */
export async function getVendorStoreOrderStats(storeId: number) {
  return customInstance<VendorOrderStatsResponse>({
    url: `/vendor/stores/${storeId}/orders/stats`,
    method: 'GET'
  });
}

/** Fetch a single order scoped to a vendor store. */
export async function getVendorStoreOrder(storeId: number, orderId: number) {
  return customInstance<VendorOrderDetailResponse>({
    url: `/vendor/stores/${storeId}/orders/${orderId}`,
    method: 'GET'
  });
}

export interface VendorWorkflowStateView {
  id?: number;
  code?: string;
  name?: string;
  color?: string;
}

export interface VendorWorkflowTransitionView {
  id?: number;
  event?: string;
  name?: string;
  to_state?: VendorWorkflowStateView;
  from_state?: VendorWorkflowStateView;
}

export interface VendorOrderTransitionsResponse {
  data?: {
    current_state?: VendorWorkflowStateView;
    transitions?: VendorWorkflowTransitionView[];
  };
}

export interface VendorOrderTransitionRequest {
  event: string;
  note?: string;
  tracking_number?: string;
}

/** List workflow transitions a vendor may apply to an order. */
export async function getVendorStoreOrderTransitions(storeId: number, orderId: number) {
  return customInstance<VendorOrderTransitionsResponse>({
    url: `/vendor/stores/${storeId}/orders/${orderId}/available-transitions`,
    method: 'GET'
  });
}

/** Apply a workflow transition to a vendor-scoped order. */
export async function performVendorStoreOrderTransition(
  storeId: number,
  orderId: number,
  body: VendorOrderTransitionRequest
) {
  return customInstance<VendorOrderDetailResponse>({
    url: `/vendor/stores/${storeId}/orders/${orderId}/transition`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: body
  });
}
