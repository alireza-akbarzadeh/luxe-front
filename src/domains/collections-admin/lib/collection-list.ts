import type {
  DtoCollectionListResponse,
  DtoCollectionResponse
} from '@/services/-collections-get.schemas';

export function getCollectionsFromListResponse(
  data: DtoCollectionListResponse | undefined
): DtoCollectionResponse[] {
  return data?.data?.collections ?? [];
}

export function getCollectionsTotalFromListResponse(
  data: DtoCollectionListResponse | undefined
): number | undefined {
  return data?.data?.total;
}
