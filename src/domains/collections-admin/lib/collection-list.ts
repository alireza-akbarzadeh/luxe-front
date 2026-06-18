import type {
  DtoCollectionResponse,
  GetCollections200
} from '@/services/-collections-get.schemas';

export function getCollectionsFromListResponse(
  data: GetCollections200 | undefined
): DtoCollectionResponse[] {
  return data?.data?.collections ?? [];
}

export function getCollectionsTotalFromListResponse(
  data: GetCollections200 | undefined
): number | undefined {
  return data?.data?.total;
}
