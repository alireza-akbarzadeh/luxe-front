import { customInstance } from '@/lib/api/api-client';

export interface ReorderNavMenusRequest {
  items: Array<{ id: number; order: number }>;
}

/** Persist storefront nav display order without rewriting mega-menu JSON payloads. */
export function reorderNavMenus(data: ReorderNavMenusRequest) {
  return customInstance<{ success?: boolean; message?: string }>({
    url: '/nav-menus/reorder',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data
  });
}
