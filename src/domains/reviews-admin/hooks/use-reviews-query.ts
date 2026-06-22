import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { ReviewStatusFilter } from '@/domains/reviews-admin/reviews.schema';

const STATUS_VALUES = ['all', 'pending', 'approved', 'rejected'] as const;

export function useReviewsQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<ReviewStatusFilter>([...STATUS_VALUES]).withDefault('pending')
  );

  return { status, setStatus };
}
