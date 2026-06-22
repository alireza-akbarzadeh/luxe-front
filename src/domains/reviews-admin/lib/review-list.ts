import type { DtoAdminReviewResponse } from '@/services/-admin-reviews-get.schemas';
import type { UtilsResponse } from '@/services/-admin-reviews-get.schemas';

export type GetAdminReviews200 = UtilsResponse & {
  data?: {
    reviews?: DtoAdminReviewResponse[];
    total?: number;
    limit?: number;
    offset?: number;
  };
};

export type { DtoAdminReviewResponse };

export function getReviewsFromListResponse(
  data: GetAdminReviews200 | undefined
): DtoAdminReviewResponse[] {
  return data?.data?.reviews ?? [];
}

export function getReviewsTotalFromListResponse(data: GetAdminReviews200 | undefined): number | undefined {
  return data?.data?.total;
}
