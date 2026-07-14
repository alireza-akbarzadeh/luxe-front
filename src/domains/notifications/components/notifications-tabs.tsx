'use client';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import {
  NOTIFICATION_CATEGORY_CONFIG,
  type NotificationCategory
} from '@/domains/notifications/lib/notification-categories';
import { cn } from '@/lib/utils';

interface NotificationsTabsProps {
  activeCategory: NotificationCategory;
  counts: Record<NotificationCategory, number>;
  onCategoryChange: (category: NotificationCategory) => void;
}

export function NotificationsTabs({
  activeCategory,
  counts,
  onCategoryChange
}: NotificationsTabsProps) {
  const t = useTranslations('notifications.inbox.categories');

  return (
    <div className='border-border/60 -mx-1 overflow-x-auto border-b pb-px'>
      <div className='flex min-w-max gap-1 px-1'>
        {NOTIFICATION_CATEGORY_CONFIG.map(({ id, icon: Icon }) => {
          const isActive = activeCategory === id;
          const count = counts[id] ?? 0;

          return (
            <button
              key={id}
              type='button'
              onClick={() => onCategoryChange(id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className='size-4 shrink-0' stroke={1.75} aria-hidden />
              <span>{t(id)}</span>
              <Badge
                variant='secondary'
                className={cn(
                  'h-5 min-w-5 rounded-full px-1.5 text-[10px] tabular-nums',
                  isActive ? 'bg-gold/15 text-gold-strong' : 'bg-muted text-muted-foreground'
                )}
              >
                {count}
              </Badge>
              {isActive ? (
                <span className='bg-gold absolute inset-x-3 -bottom-px h-0.5 rounded-full' />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
