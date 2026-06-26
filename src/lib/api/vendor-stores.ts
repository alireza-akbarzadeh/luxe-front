import { customInstance } from '@/lib/api/api-client';

export interface VendorStoreSummary {
  id: number;
  name: string;
  slug: string;
  description?: string;
  location?: string;
  status?: string;
}

export interface VendorStoreDetail extends VendorStoreSummary {
  logo_url?: string;
  banner_url?: string;
  shipping_info?: string;
  return_policy?: string;
  is_verified?: boolean;
  settings?: Record<string, string>;
  category_ids?: number[];
}

export interface VendorCreateStorePayload {
  name: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  location: string;
  shipping_info: string;
  return_policy: string;
  business_legal_name: string;
  business_type: 'individual' | 'company' | 'brand';
  country: string;
  website?: string;
  tax_id?: string;
  fulfillment_model: 'self' | 'platform' | 'hybrid';
  category_ids?: number[];
  latitude?: number;
  longitude?: number;
}

export interface VendorUpdateStorePayload {
  name?: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  location?: string;
  shipping_info?: string;
  return_policy?: string;
  business_legal_name?: string;
  business_type?: 'individual' | 'company' | 'brand';
  country?: string;
  website?: string;
  tax_id?: string;
  fulfillment_model?: 'self' | 'platform' | 'hybrid';
  category_ids?: number[];
  latitude?: number;
  longitude?: number;
}

export interface AdminStoreSummary {
  id: number;
  name: string;
  slug: string;
  status: string;
  location?: string;
  user_id?: number;
  owner_email?: string;
  is_verified?: boolean;
  created_at?: string;
  settings?: Record<string, string>;
}

interface VendorStoresResponse {
  data?: VendorStoreSummary[];
}

interface VendorStoreResponse {
  data?: VendorStoreDetail;
}

interface AdminStoresListResponse {
  data?: {
    stores?: AdminStoreSummary[];
    total?: number;
    limit?: number;
    offset?: number;
  };
}

/** List stores the current user can manage in the vendor panel. */
export async function listVendorStores() {
  return customInstance<VendorStoresResponse>({
    url: '/vendor/stores',
    method: 'GET'
  });
}

/** Fetch a vendor-owned store with settings. */
export async function getVendorStore(id: number) {
  return customInstance<VendorStoreResponse>({
    url: `/vendor/stores/${id}`,
    method: 'GET'
  });
}

/** Update a vendor-owned store. */
export async function updateVendorStore(id: number, payload: VendorUpdateStorePayload) {
  return customInstance<VendorStoreResponse>({
    url: `/vendor/stores/${id}`,
    method: 'PUT',
    data: payload
  });
}

/** Self-service seller onboarding — creates a store owned by the current user. */
export async function createVendorStore(payload: VendorCreateStorePayload) {
  return customInstance<VendorStoreResponse>({
    url: '/vendor/stores',
    method: 'POST',
    data: payload
  });
}

/** Admin: list stores including pending applications. */
export async function listAdminStores(params?: {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
}) {
  return customInstance<AdminStoresListResponse>({
    url: '/admin/stores',
    method: 'GET',
    params
  });
}

/** Admin: update store status (approve/reject). */
export async function updateAdminStore(
  id: number,
  payload: { status?: string; is_verified?: boolean }
) {
  return customInstance({
    url: `/admin/stores/${id}`,
    method: 'PUT',
    data: payload
  });
}
