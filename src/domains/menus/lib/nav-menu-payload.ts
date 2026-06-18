import type { SiteMenuFormValues } from '@/domains/menus/schemas/site-menu.schema';
import type { DtoUpsertNavMenuRequest } from '@/services/-nav-menus-{id}-put.schemas';
import type { DtoNavItemResponse } from '@/services/-nav-menus-get.schemas';
import { DtoUpsertNavMenuRequestType } from '@/services/-nav-menus-post.schemas';

/** Map an API nav item to site-menu form values (edit dialog). */
export function toSiteMenuFormValues(
  item: DtoNavItemResponse,
  orderOverride?: number
): SiteMenuFormValues {
  return {
    label: item.label ?? '',
    type: item.type === 'mega' ? 'mega' : 'link',
    href: item.href ?? '',
    badge: item.badge ?? '',
    order: orderOverride ?? item.order ?? 0,
    viewAllLabel: item.viewAll?.label ?? '',
    viewAllHref: item.viewAll?.href ?? '',
    columns: (item.columns ?? []).map((column) => ({
      title: column.title ?? '',
      links: (column.links ?? []).map((link) => ({
        title: link.title ?? '',
        href: link.href ?? ''
      }))
    })),
    featured: (item.featured ?? []).map((card) => ({
      title: card.title ?? '',
      description: card.description ?? '',
      href: card.href ?? '',
      image: card.image ?? '',
      badge: card.badge ?? ''
    }))
  };
}

/** Sort nav items by their persisted display order. */
export function sortNavMenuItems(items: DtoNavItemResponse[]) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Move one item within a list (used while dragging). */
export function reorderList<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  if (moved === undefined) return items;
  next.splice(toIndex, 0, moved);
  return next;
}

/** Map an API nav item to the upsert payload used by PUT /nav-menus/:id. */
export function toNavMenuUpsertPayload(
  item: DtoNavItemResponse,
  order: number
): DtoUpsertNavMenuRequest {
  const isMega = item.type === 'mega';

  return {
    label: item.label ?? '',
    type: isMega ? DtoUpsertNavMenuRequestType.mega : DtoUpsertNavMenuRequestType.link,
    href: !isMega ? item.href : undefined,
    badge: item.badge,
    order,
    viewAll: isMega ? item.viewAll : undefined,
    columns: isMega ? item.columns : undefined,
    featured: isMega ? item.featured : undefined
  };
}
