import type {
  DtoBlogListResponse,
  DtoBlogPostListItem
} from '@/services/-admin-blog-posts-get.schemas';

/** Normalizes admin blog list payloads into post rows. */
export function getBlogPostsFromListResponse(
  data: DtoBlogListResponse | undefined
): DtoBlogPostListItem[] {
  return data?.data?.posts ?? [];
}

/** Returns server total when available. */
export function getBlogPostsTotalFromListResponse(
  data: DtoBlogListResponse | undefined
): number | undefined {
  return data?.data?.total;
}
