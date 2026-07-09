import type {
  DtoMenuGroupResponse,
  DtoMenuItemResponse
} from '@/services/-user-menu-structure-get.schemas';

import type { AdminNavLink } from '../types/admin-nav.types';

function flattenMenuItems(items: DtoMenuItemResponse[] | undefined, acc: AdminNavLink[] = []) {
  for (const item of items ?? []) {
    if (item.href) {
      acc.push({ href: item.href, label: item.label ?? item.href });
    }
    if (item.children?.length) flattenMenuItems(item.children, acc);
  }
  return acc;
}

/** Maps favorite hrefs to sidebar labels using the current menu tree. */
export function resolveFavoriteLinks(
  favorites: string[],
  groups: DtoMenuGroupResponse[]
): AdminNavLink[] {
  const allLinks = groups.flatMap((group) => flattenMenuItems(group.items));
  return favorites
    .map(
      (href) =>
        allLinks.find((link) => link.href === href) ?? {
          href,
          label: href.replace('/dashboard/', '')
        }
    )
    .filter((item) => item.href.startsWith('/dashboard'));
}
