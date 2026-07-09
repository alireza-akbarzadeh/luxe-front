'use client';

import { IconChevronRight, IconHome } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';

import type {
  DtoMenuGroupResponse,
  DtoMenuItemResponse
} from '@/services/-user-menu-structure-get.schemas';

export function DashboardBreadcrumbs({
  pathname,
  sidebar_menu
}: {
  pathname: string;
  sidebar_menu: DtoMenuGroupResponse[];
}) {
  const breadcrumbs = useMemo(() => {
    const findMenuItemByHref = (
      items: DtoMenuItemResponse[],
      href: string
    ): DtoMenuItemResponse | null => {
      for (const item of items) {
        if (item.href === href) return item;
        if (item.children?.length) {
          const found = findMenuItemByHref(item.children, href);
          if (found) return found;
        }
      }
      return null;
    };

    // 2. Build the ancestor chain (from root to target item)
    const buildAncestorChain = (
      items: DtoMenuItemResponse[],
      targetHref: string,
      ancestors: DtoMenuItemResponse[] = []
    ): DtoMenuItemResponse[] | null => {
      for (const item of items) {
        if (item.href === targetHref) {
          return [...ancestors, item];
        }
        if (item.children?.length) {
          const result = buildAncestorChain(item.children, targetHref, [...ancestors, item]);
          if (result) return result;
        }
      }
      return null;
    };

    // Collect all items from all groups (flat list for searching)
    const allItems = sidebar_menu.flatMap((group) => group.items || []);

    // Try to find the exact menu item for the current pathname
    let matchedItem = findMenuItemByHref(allItems, pathname);

    if (!matchedItem) {
      // Fallback: try to match against a "normalized" path (remove trailing slash, etc.)
      const normalizedPath = pathname.replace(/\/$/, '');
      matchedItem = findMenuItemByHref(allItems, normalizedPath);
    }

    let breadcrumbItems: Array<{ label: string; href: string; isLast: boolean }> = [];

    if (matchedItem) {
      // Build the full ancestor chain (including the matched item)
      const chain = buildAncestorChain(allItems, matchedItem.href as string);
      if (chain) {
        breadcrumbItems = chain.map((item, idx) => ({
          label: item.label ?? '',
          href: item.href ?? '',
          isLast: idx === chain.length - 1
        }));
      }
    } else {
      // Fallback to URL‑based breadcrumbs (original behaviour)
      const paths = pathname.split('/').filter(Boolean);
      breadcrumbItems = paths.map((segment, index) => {
        const currentPath = '/' + paths.slice(0, index + 1).join('/');
        let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        // Try to find a label from the menu (shallow search)
        for (const group of sidebar_menu) {
          for (const item of group.items ?? []) {
            if (item.href === currentPath) {
              label = item.label || '';
              break;
            }
            if (item.children) {
              const child = item.children.find((c) => c.href === currentPath);
              if (child) {
                label = child.label || '';
                break;
              }
            }
          }
        }

        return {
          label,
          href: currentPath,
          isLast: index === paths.length - 1
        };
      });
    }

    // If the only breadcrumb is the dashboard home, hide it (optional)
    if (breadcrumbItems.length === 1 && breadcrumbItems?.[0]?.href === '/dashboard') {
      return null;
    }

    return breadcrumbItems;
  }, [pathname, sidebar_menu]);

  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  return (
    <nav className='text-muted-foreground bg-muted/20 border-border/40 hidden items-center gap-2 rounded-full border p-2.5 text-sm lg:flex'>
      <Link
        href='/dashboard'
        className='text-muted-foreground hover:text-primary transition-colors'
      >
        <IconHome size={15} />
      </Link>

      {breadcrumbs.map((crumb) => (
        <div key={crumb.href} className='flex items-center gap-2'>
          <IconChevronRight size={14} className='text-muted-foreground/50' />
          {crumb.isLast ? (
            <span className='text-foreground font-semibold tracking-tight'>{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
