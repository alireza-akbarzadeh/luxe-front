import type { VendorNavGroup, VendorNavItem } from '@/domains/vendor/vendor-panel-nav';
import { flattenVendorNavGroups } from '@/domains/vendor/vendor-panel-nav';

/** Maps pinned hrefs to localized nav items from the current vendor menu tree. */
export function resolveVendorFavoriteLinks(
  favoriteHrefs: string[],
  groups: VendorNavGroup[]
): VendorNavItem[] {
  const allItems = flattenVendorNavGroups(groups);
  const byHref = new Map(allItems.map((item) => [item.href, item]));

  return favoriteHrefs
    .map((href) => byHref.get(href))
    .filter((item): item is VendorNavItem => item != null);
}

/** Whether a vendor panel pathname matches a nav item href. */
export function isVendorNavPathActive(pathname: string, href: string): boolean {
  return href === '/vendor/panel' ? pathname === href : pathname.startsWith(href);
}
