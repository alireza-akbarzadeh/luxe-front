export type { UtilsResponse, GetAdminReturnsParams } from './-admin-returns-get.schemas';

export type {
  DtoReturnResponse,
  DtoStateView,
  GetAdminReturnsId200
} from './-admin-returns-{id}-get.schemas';

import type { UtilsResponse } from './-admin-returns-get.schemas';
import type { DtoReturnResponse } from './-admin-returns-{id}-get.schemas';

export interface DtoAdminReturnListData {
  limit?: number;
  offset?: number;
  returns?: DtoReturnResponse[];
  total?: number;
}

export type GetAdminReturns200 = UtilsResponse & {
  data?: DtoAdminReturnListData;
};
