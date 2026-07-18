'use client';

import { IconStar } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import {
  SidebarNavFavoriteButton,
  SidebarNavIcon
} from '@/domains/admin/components/sidebar-nav-item-parts';
import { useAdminNavPreferences } from '@/domains/admin/hooks/use-admin-nav-preferences';
import { isPathActive, navItemClasses } from '@/domains/admin/lib/sidebar-nav-utils';
import type { AdminNavLink } from '@/domains/admin/types/admin-nav.types';
import { cn } from '@/lib/utils';

interface AdminNavFavoritesProps {
  items: AdminNavLink[];
  isCollapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}

/** Favorites menu group — pinned links from GET/PUT /admin/nav/preferences. */
export function AdminNavFavorites({
  items,
  isCollapsed,
  pathname,
  onNavigate
}: AdminNavFavoritesProps) {
  const t = useTranslations('adminShell.nav');
  const { isFavorite, toggleFavorite, favoritePendingHref } = useAdminNavPreferences();

  if (isCollapsed) {
    if (items.length === 0) return null;
    return (
      <div className='flex w-full flex-col items-center gap-0.5'>
        {items.map((item) => {
          const active = isPathActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={navItemClasses(active, true)}
            >
              <SidebarNavIcon iconName={item.icon ?? 'Star'} active={active} />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className='w-full space-y-1'>
      <h4 className='text-muted-foreground mb-1.5 flex items-center gap-1.5 px-3 text-[10px] font-bold tracking-[0.16em] whitespace-nowrap uppercase'>
        <IconStar className='size-3 text-amber-500' aria-hidden />
        {t('favorites')}
      </h4>

      {items.length === 0 ? (
        <p className='text-muted-foreground px-3 text-[11px] leading-snug'>{t('favoritesEmpty')}</p>
      ) : (
        <div className='space-y-0.5'>
          {items.map((item) => {
            const active = isPathActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(navItemClasses(active, false), 'w-full')}
              >
                <SidebarNavIcon iconName={item.icon ?? 'Star'} active={active} />
                <span className='flex-1 truncate'>{item.label}</span>
                <SidebarNavFavoriteButton
                  href={item.href}
                  label={item.label}
                  isCollapsed={false}
                  isFavorite={isFavorite}
                  favoritePendingHref={favoritePendingHref}
                  onToggle={(href, label) => void toggleFavorite(href, label)}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
