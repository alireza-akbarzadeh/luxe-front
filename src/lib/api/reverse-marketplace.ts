import { customInstance } from '@/lib/api/api-client';

export interface ReverseMarketplaceRequestListItem {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  status?: string;
  offer_count?: number;
  created_at?: string;
}

export interface ReverseMarketplaceOffer {
  id?: number;
  store_id?: number;
  store_name?: string;
  message?: string;
  offered_price?: number;
  status?: string;
  created_at?: string;
}

export interface ReverseMarketplaceRequestDetail {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  status?: string;
  created_at?: string;
  offers?: ReverseMarketplaceOffer[];
}

export interface ReverseMarketplaceListResponse {
  data?: {
    requests?: ReverseMarketplaceRequestListItem[];
    total?: number;
    limit?: number;
    offset?: number;
  };
}

export interface ReverseMarketplaceDetailResponse {
  data?: ReverseMarketplaceRequestDetail;
}

export interface CreateReverseMarketplaceRequestPayload {
  title: string;
  description?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
}

export interface CreateReverseMarketplaceOfferPayload {
  message?: string;
  offered_price: number;
}

export async function listReverseMarketplaceRequests(limit = 12, offset = 0) {
  return customInstance<ReverseMarketplaceListResponse>({
    url: '/reverse-marketplace/requests',
    method: 'GET',
    params: { limit, offset }
  });
}

export async function getReverseMarketplaceRequest(id: number) {
  return customInstance<ReverseMarketplaceDetailResponse>({
    url: `/reverse-marketplace/requests/${id}`,
    method: 'GET'
  });
}

export async function createReverseMarketplaceRequest(payload: CreateReverseMarketplaceRequestPayload) {
  return customInstance<ReverseMarketplaceDetailResponse>({
    url: '/reverse-marketplace/requests',
    method: 'POST',
    data: payload
  });
}

export async function listVendorReverseMarketplaceRequests(storeId: number, limit = 12, offset = 0) {
  return customInstance<ReverseMarketplaceListResponse>({
    url: `/vendor/stores/${storeId}/reverse-marketplace/requests`,
    method: 'GET',
    params: { limit, offset }
  });
}

export async function createVendorReverseMarketplaceOffer(
  storeId: number,
  requestId: number,
  payload: CreateReverseMarketplaceOfferPayload
) {
  return customInstance<{ data?: ReverseMarketplaceOffer }>({
    url: `/vendor/stores/${storeId}/reverse-marketplace/requests/${requestId}/offers`,
    method: 'POST',
    data: payload
  });
}
