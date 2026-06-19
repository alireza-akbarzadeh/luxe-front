/**
 * Hand-maintained until `pnpm api:gen` includes GET /vendor/stores.
 */
import type { DtoStoreResponse, UtilsResponse } from './-stores-get.schemas';

export type GetVendorStores200 = UtilsResponse & {
  data?: DtoStoreResponse[];
};
