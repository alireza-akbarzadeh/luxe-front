'use client';

import { IconStar } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { VendorNavFavoriteButton } from '@/domains/vendor/panel/components/layout/vendor-nav-favorite-button';
import { useVendorNavFavorites } from '@/domains/vendor/panel/hooks/use-vendor-nav-favorites';
import { isVendorNavPathActive } from '@/domains/vendor/panel/lib/vendor-nav-utils';
import type { VendorNavItem } from '@/domains/vendor/vendor-panel-nav';
import { cn } from '@/lib/utils';

interface VendorNavFavoritesProps {
  items: VendorNavItem[];
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}

/** Pinned vendor panel routes shown at the top of the sidebar. */
export function VendorNavFavorites({
  items,
  pathname,
  collapsed,
  onNavigate
}: VendorNavFavoritesProps) {
  const t = useTranslations('vendor.panel.nav');
  const { isFavorite, toggleFavorite } = useVendorNavFavorites();

  if (collapsed) {
    if (items.length === 0) {
      return null;
    }

    return (
      <nav className='flex w-full flex-col items-center gap-0.5' aria-label={t('favorites')}>
        {items.map((item) => {
          const active = isVendorNavPathActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={item.label}
              className={cn(
                'dashboard-nav-item justify-center px-2',
                active && 'dashboard-nav-item-active'
              )}
            >
              <Icon className='size-4 shrink-0' aria-hidden />
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <section className='w-full space-y-1' aria-label={t('favorites')}>
      <h4 className='text-muted-foreground mb-1.5 flex items-center gap-1.5 px-3 text-[10px] font-bold tracking-[0.16em] whitespace-nowrap uppercase'>
        <IconStar className='size-3 text-amber-500' aria-hidden />
        {t('favorites')}
      </h4>

      {items.length === 0 ? (
        <p className='text-muted-foreground px-3 text-[11px] leading-snug'>{t('favoritesEmpty')}</p>
      ) : (
        <nav className='space-y-0.5'>
          {items.map((item) => {
            const active = isVendorNavPathActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'dashboard-nav-item group w-full',
                  active && 'dashboard-nav-item-active'
                )}
              >
                <Icon className='size-4 shrink-0' aria-hidden />
                <span className='flex-1 truncate'>{item.label}</span>
                <VendorNavFavoriteButton
                  href={item.href}
                  label={item.label}
                  isCollapsed={false}
                  isFavorite={isFavorite}
                  onToggle={toggleFavorite}
                />
              </Link>
            );
          })}
        </nav>
      )}
    </section>
  );
}
