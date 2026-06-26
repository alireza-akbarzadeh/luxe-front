import { customInstance } from '@/lib/api/api-client';

export interface VendorStoreSummary {
  id: number;
  name: string;
  slug: string;
  description?: string;
  location?: string;
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
}

interface VendorStoresResponse {
  data?: VendorStoreSummary[];
}

interface VendorStoreResponse {
  data?: VendorStoreSummary;
}

/** List stores the current user can manage in the vendor panel. */
export async function listVendorStores() {
  return customInstance<VendorStoresResponse>({
    url: '/vendor/stores',
    method: 'GET'
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
