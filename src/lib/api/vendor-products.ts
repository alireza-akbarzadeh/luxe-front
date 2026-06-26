import { customInstance } from '@/lib/api/api-client';

export interface VendorProductListItem {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  status: string;
  category?: string;
  image?: string;
  low_stock: boolean;
}

export interface VendorProductsListParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
}

export interface VendorProductsListResponse {
  data?: {
    products?: VendorProductListItem[];
    total?: number;
    limit?: number;
    offset?: number;
  };
}

export interface VendorProductStatsResponse {
  data?: {
    total?: number;
    by_status?: Record<string, number>;
    low_stock?: number;
  };
}

/** List products for a vendor-owned store with filters. */
export async function listVendorStoreProducts(storeId: number, params: VendorProductsListParams) {
  return customInstance<VendorProductsListResponse>({
    url: `/vendor/stores/${storeId}/products`,
    method: 'GET',
    params: {
      limit: params.limit,
      offset: params.offset,
      search: params.search,
      status: params.status
    }
  });
}

/** Product count summaries for vendor dashboard. */
export async function getVendorStoreProductStats(storeId: number) {
  return customInstance<VendorProductStatsResponse>({
    url: `/vendor/stores/${storeId}/products/stats`,
    method: 'GET'
  });
}
