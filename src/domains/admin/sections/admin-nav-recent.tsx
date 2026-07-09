'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Text } from '@/components/ui/typography';
import type { DtoAdminNavRecentPage } from '@/services/-admin-nav-preferences-get.schemas';

interface AdminNavRecentProps {
  items: DtoAdminNavRecentPage[];
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export function AdminNavRecent({ items, isCollapsed, onNavigate }: AdminNavRecentProps) {
  const t = useTranslations('adminShell.nav');
  if (items.length === 0 || isCollapsed) return null;

  return (
    <div className='px-3 pb-2'>
      <Text variant='overline' className='px-2 pb-1'>
        {t('recent')}
      </Text>
      <div className='space-y-0.5'>
        {items.slice(0, 5).map((item) => (
          <Link
            key={`${item.href}-${item.visited_at}`}
            href={item.href ?? '#'}
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
