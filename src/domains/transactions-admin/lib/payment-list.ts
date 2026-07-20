import type { GetAdminPayments200 } from '@/services/-admin-payments-get.schemas';
import type { DtoAdminPaymentListItem } from '@/services/-admin-payments-get.schemas';

/** Extract payment rows from the admin list response. */
export function getPaymentsFromListResponse(
  data: GetAdminPayments200 | undefined
): DtoAdminPaymentListItem[] {
  return data?.data?.payments ?? [];
}

/** Extract total count for server pagination. */
export function getPaymentsTotalFromListResponse(
  data: GetAdminPayments200 | undefined
): number | undefined {
  const total = data?.data?.total;
  return typeof total === 'number' ? total : undefined;
}
