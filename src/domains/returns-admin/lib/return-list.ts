import type { DtoReturnResponse } from '@/services/-admin-returns-{id}-get.schemas';
import type { UtilsResponse } from '@/services/-admin-returns-get.schemas';

export type GetAdminReturns200 = UtilsResponse & {
  data?: {
    returns?: DtoReturnResponse[];
    total?: number;
    limit?: number;
    offset?: number;
  };
};

export type { DtoReturnResponse };

export function getReturnsFromListResponse(
  data: GetAdminReturns200 | undefined
): DtoReturnResponse[] {
  return data?.data?.returns ?? [];
}

export function getReturnsTotalFromListResponse(data: GetAdminReturns200 | undefined): number | undefined {
  return data?.data?.total;
}
