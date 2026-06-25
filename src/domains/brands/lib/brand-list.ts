import type { DtoBrandListResponse, DtoBrandResponse } from '@/services/-brands-get.schemas';

/** Normalizes list API payloads into brand rows. */
export function getBrandsFromListResponse(data: DtoBrandListResponse | undefined): DtoBrandResponse[] {
  return data?.data?.brands ?? [];
}

/** Returns server total when available. */
export function getBrandsTotalFromListResponse(
  data: DtoBrandListResponse | undefined
): number | undefined {
  return data?.data?.total;
}
