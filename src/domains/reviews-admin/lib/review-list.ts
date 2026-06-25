import type { UtilsResponse } from '@/services/-admin-reviews-get.schemas';
import type { DtoStateView } from '@/services/-workflows-{key}-{entityId}-available-transitions-get.schemas';

/** Admin review row — mirrors backend dto.AdminReviewResponse until OpenAPI exposes it. */
export interface DtoAdminReviewResponse {
  id?: number;
  created_at?: string;
  updated_at?: string;
  product_id?: number;
  product_name?: string;
  user_id?: number;
  rating?: number;
  comment?: string;
  title?: string;
  status?: string;
  author?: string;
  state?: DtoStateView;
}

export type GetAdminReviews200 = UtilsResponse & {
  data?: {
    reviews?: DtoAdminReviewResponse[];
    total?: number;
    limit?: number;
    offset?: number;
  };
};

export function getReviewsFromListResponse(
  data: GetAdminReviews200 | undefined
): DtoAdminReviewResponse[] {
  return data?.data?.reviews ?? [];
}

export function getReviewsTotalFromListResponse(
  data: GetAdminReviews200 | undefined
): number | undefined {
  return data?.data?.total;
}
