import type {
  DtoReturnResponse,
  GetAdminReturns200
} from '@/services/-admin-returns.schemas';

export function getReturnsFromListResponse(
  data: GetAdminReturns200 | undefined
): DtoReturnResponse[] {
  return data?.data?.returns ?? [];
}

export function getReturnsTotalFromListResponse(data: GetAdminReturns200 | undefined): number | undefined {
  return data?.data?.total;
}
