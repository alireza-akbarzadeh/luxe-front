import type { DtoBrandResponse, GetBrands200 } from '@/services/-brands-get.schemas';

/** Normalizes list API payloads into brand rows. */
export function getBrandsFromListResponse(data: GetBrands200 | undefined): DtoBrandResponse[] {
  return data?.data?.brands ?? [];
}

/** Returns server total when available. */
export function getBrandsTotalFromListResponse(data: GetBrands200 | undefined): number | undefined {
  return data?.data?.total;
}
