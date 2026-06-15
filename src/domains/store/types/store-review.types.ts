/**
 * Store review API response types (aligned with backend dto.StoreReviewResponse).
 * Orval generates UtilsResponse-only types until swagger documents nested data shapes.
 */
export interface StoreReviewResponse {
  id?: number;
  store_id?: number;
  user_id?: number;
  rating?: number;
  comment?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  is_owner?: boolean;
}

export interface StoreReviewSummary {
  average?: number;
  total?: number;
  counts?: Record<string, number>;
}

export interface StoreReviewsListData {
  reviews?: StoreReviewResponse[];
  total?: number;
  limit?: number;
  offset?: number;
  summary?: StoreReviewSummary;
}

export interface StoreReviewsListResponse {
  success?: boolean;
  message?: string;
  data?: StoreReviewsListData;
}

export interface StoreReviewMeResponse {
  success?: boolean;
  message?: string;
  data?: StoreReviewResponse | null;
}
