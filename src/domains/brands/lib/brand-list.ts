import type { DtoBrandResponse, GetBrands200 } from '@/services/-brands-get.schemas';

/** Normalizes list API payloads (paginated wrapper or legacy flat array). */
export function getBrandsFromListResponse(data: GetBrands200 | undefined): DtoBrandResponse[] {
  const payload = data?.data;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.brands ?? [];
}

/** Returns server total when available; undefined for legacy flat-array responses. */
export function getBrandsTotalFromListResponse(
  data: GetBrands200 | undefined
): number | undefined {
  const payload = data?.data;
  if (!payload || Array.isArray(payload)) return undefined;
  return payload.total;
}
