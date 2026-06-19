/**
 * Hand-maintained until `pnpm api:gen` is run after backend swagger update.
 */
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

export interface UtilsResponse {
  code?: number;
  error?: string;
  message?: string;
  success?: boolean;
}

export type GetAdminStoresId200 = UtilsResponse & {
  data?: DtoStoreResponse;
};
