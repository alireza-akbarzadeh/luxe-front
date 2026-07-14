'use client';

import { IconBellRinging, IconChevronRight, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text, Typography } from '@/components/ui/typography';
import { usePushNotifications } from '@/domains/account/hooks/use-push-notifications';
import {
  NOTIFICATION_CATEGORY_CONFIG,
  type NotificationCategory
} from '@/domains/notifications/lib/notification-categories';
import { cn } from '@/lib/utils';

const PUSH_PROMO_DISMISS_KEY = 'luxe.notifications.push-promo.dismissed';

interface NotificationsPushPromoProps {
  className?: string;
}

export function NotificationsPushPromo({ className }: NotificationsPushPromoProps) {
  const t = useTranslations('notifications.inbox.pushPromo');
  const { supportStatus, isSubscribed, isPending, toggle } = usePushNotifications();
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(PUSH_PROMO_DISMISS_KEY) === '1';
  });

  if (supportStatus === 'unsupported' || isSubscribed || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    window.localStorage.setItem(PUSH_PROMO_DISMISS_KEY, '1');
    setIsDismissed(true);
  };

  const handleEnable = async () => {
    try {
      await toggle();
      toast.success(t('enabledSuccess'));
    } catch {
      toast.error(t('enableError'));
    }
  };

  return (
    <div
      className={cn(
        'border-gold/20 from-gold/10 via-card to-card relative overflow-hidden rounded-2xl border bg-linear-to-br p-5',
        className
      )}
    >
      <button
        type='button'
        onClick={handleDismiss}
        className='text-muted-foreground hover:text-foreground absolute top-3 right-3 rounded-full p-1'
        aria-label={t('dismiss')}
      >
        <IconX className='size-4' />
      </button>

      <Flex direction='column' gap={4}>
        <div>
          <Typography.H4 className='text-base font-semibold'>{t('title')}</Typography.H4>
          <Text variant='muted' className='mt-1 text-sm leading-relaxed'>
            {t('description')}
          </Text>
        </div>

        <Button
          variant='outline'
          className='border-gold/30 w-fit rounded-full'
          disabled={isPending || supportStatus === 'denied'}
          onClick={() => void handleEnable()}
        >
          {isPending ? t('enabling') : t('enableNow')}
        </Button>
      </Flex>

      <IconBellRinging
        className='text-gold/20 pointer-events-none absolute -right-2 -bottom-2 size-24'
        stroke={1}
        aria-hidden
      />
    </div>
  );
}

interface NotificationsSidebarProps {
  activeCategory: NotificationCategory;
  counts: Record<NotificationCategory, number>;
  onCategoryChange: (category: NotificationCategory) => void;
}

export function NotificationsSidebar({
  activeCategory,
  counts,
  onCategoryChange
}: NotificationsSidebarProps) {
  const t = useTranslations('notifications.inbox');
  const tCategories = useTranslations('notifications.inbox.categories');

  return (
    <aside className='hidden space-y-6 lg:block'>
      <nav aria-label={t('sidebarNav')}>
        <ul className='space-y-1'>
          {NOTIFICATION_CATEGORY_CONFIG.map(({ id, icon: Icon }) => {
            const isActive = activeCategory === id;
            const count = counts[id] ?? 0;

            return (
              <li key={id}>
                <button
                  type='button'
                  onClick={() => onCategoryChange(id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                    isActive
                      ? 'bg-gold/10 text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  )}
                >
                  <Icon className='size-4 shrink-0' stroke={1.75} aria-hidden />
                  <span className='flex-1'>{tCategories(id)}</span>
                  <span className='text-muted-foreground text-xs tabular-nums'>{count}</span>
                  {isActive ? (
                    <span className='bg-gold ml-1 h-5 w-0.5 rounded-full' aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <NotificationsPushPromo />

      <Link
        href='/account?tab=settings'
        className='border-border/60 hover:bg-muted/30 flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors'
      >
        <div>
          <p className='font-medium'>{t('settingsLink')}</p>
          <p className='text-muted-foreground mt-0.5 text-xs'>{t('settingsHint')}</p>
        </div>
        <IconChevronRight className='text-muted-foreground cn-rtl-flip size-4 shrink-0' />
      </Link>
    </aside>
  );
}
