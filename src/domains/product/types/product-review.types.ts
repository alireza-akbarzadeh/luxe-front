/** Product review API response types (aligned with backend dto.ReviewResponse). */
export interface ProductReviewResponse {
  id?: number;
  product_id?: number;
  user_id?: number;
  rating?: number;
  title?: string;
  comment?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  is_verified?: boolean;
  is_owner?: boolean;
}

export interface ProductReviewSummary {
  average?: number;
  total?: number;
  counts?: Record<string, number>;
}

export interface ProductReviewsListData {
  reviews?: ProductReviewResponse[];
  total?: number;
  limit?: number;
  offset?: number;
  summary?: ProductReviewSummary;
}

export interface ProductReviewsListResponse {
  success?: boolean;
  message?: string;
  data?: ProductReviewsListData;
}

export interface ProductReviewMeResponse {
  success?: boolean;
  message?: string;
  data?: ProductReviewResponse | null;
}
