'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Text } from '@/components/ui/typography';
import type { AdminNavLink } from '@/domains/admin/types/admin-nav.types';

interface AdminNavFavoritesProps {
  items: AdminNavLink[];
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export function AdminNavFavorites({ items, isCollapsed, onNavigate }: AdminNavFavoritesProps) {
  const t = useTranslations('adminShell.nav');
  if (items.length === 0 || isCollapsed) return null;

  return (
    <div className='px-3 pb-2'>
      <Text variant='overline' className='px-2 pb-1'>
        {t('favorites')}
      </Text>
      <div className='space-y-0.5'>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className='dashboard-nav-item block truncate px-2 py-1.5 text-xs font-medium'
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
