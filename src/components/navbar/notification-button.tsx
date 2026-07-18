'use client';

import { IconBell, IconChevronRight } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { NavbarActionButton } from '@/components/navbar/navbar-action-button';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Text, Typography } from '@/components/ui/typography';
import { useAccountNotifications } from '@/domains/account/hooks/use-account-notifications';
import {
  formatNotificationTime,
  getNotificationTypeStyle
} from '@/domains/account/lib/notification-utils';
import { useNotificationUnreadCount } from '@/domains/notifications/hooks/use-notification-unread-count';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { cn } from '@/lib/utils';

const PREVIEW_LIMIT = 5;

function getNotificationTypeKey(type?: string): string {
  if (!type) return 'update';
  const known = [
    'order_update',
    'payment_success',
    'payment_failed',
    'shipment_update',
    'membership_activated',
    'wallet_deposit'
  ];
  return known.includes(type) ? type : 'update';
}

export function NotificationButton() {
  const t = useTranslations('nav.notifications');
  const tTypes = useTranslations('account.notifications');
  const { isAuthenticated } = useAuth();
  const { openAuthDialog } = useRequireAuth();
  const { data: unreadCount = 0 } = useNotificationUnreadCount();
  const [open, setOpen] = useState(false);

  const {
    notifications,
    total,
    unreadOnPage,
    isLoading,
    isError,
    refetch,
    markAsRead,
    markAllRead,
    isMarkingAllRead
  } = useAccountNotifications(PREVIEW_LIMIT, 0, {
    enabled: isAuthenticated && open
  });

  const ariaLabel = `${t('title')}${unreadCount > 0 ? `, ${unreadCount} ${t('unread')}` : ''}`;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next && isAuthenticated) {
      void refetch();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <NavbarActionButton
          type='button'
          aria-label={ariaLabel}
          aria-expanded={open}
          className='relative'
        >
          <IconBell className='size-5' stroke={1.75} />
          <AnimatePresence mode='popLayout'>
            {isAuthenticated && unreadCount > 0 ? (
              <motion.span
                layout
                className='bg-destructive text-destructive-foreground ring-background absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold shadow-sm ring-2'
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </NavbarActionButton>
      </PopoverTrigger>

      <PopoverContent
        align='end'
        sideOffset={8}
        className='border-border/60 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl p-0 shadow-xl'
      >
        {!isAuthenticated ? (
          <Flex direction='column' align='center' gap={3} className='px-5 py-8 text-center'>
            <div className='bg-muted/60 flex size-12 items-center justify-center rounded-full'>
              <IconBell className='text-muted-foreground size-6' stroke={1.5} />
            </div>
            <div>
              <Typography.H4 className='text-base font-semibold'>{t('signInTitle')}</Typography.H4>
              <Text variant='muted' className='mt-1 text-sm leading-relaxed'>
                {t('signInDescription')}
              </Text>
            </div>
            <Button
              type='button'
              className='w-full rounded-full'
              size='sm'
              onClick={() => {
                setOpen(false);
                openAuthDialog({ callbackUrl: '/notifications', reason: 'notifications' });
              }}
            >
              {t('signInButton')}
            </Button>
          </Flex>
        ) : (
          <>
            <Flex
              align='start'
              justify='between'
              gap={3}
              className='border-border/60 bg-muted/20 border-b px-4 py-3'
            >
              <div>
                <Typography.H4 className='text-sm font-semibold'>{t('title')}</Typography.H4>
                <Text variant='muted' className='text-xs'>
                  {t('latestSubtitle', { count: Math.min(PREVIEW_LIMIT, total) })}
                </Text>
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 shrink-0 rounded-full px-2 text-xs'
                disabled={isMarkingAllRead || unreadOnPage === 0}
                onClick={() => void markAllRead()}
              >
                {t('markAllRead')}
              </Button>
            </Flex>

            <ScrollArea className='max-h-80'>
              {isLoading ? (
                <div className='space-y-2 p-3'>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className='h-16 w-full rounded-xl' />
                  ))}
                </div>
              ) : null}

              {isError ? (
                <Flex direction='column' align='center' gap={3} className='px-4 py-10 text-center'>
                  <Text className='text-destructive text-sm font-medium'>{t('loadError')}</Text>
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-full'
                    onClick={() => void refetch()}
                  >
                    {t('retry')}
                  </Button>
                </Flex>
              ) : null}

              {!isLoading && !isError && notifications.length === 0 ? (
                <Flex direction='column' align='center' gap={2} className='px-4 py-12 text-center'>
                  <div className='bg-muted/40 rounded-full p-3'>
                    <IconBell className='text-muted-foreground size-6' stroke={1.5} />
                  </div>
                  <Text className='text-sm font-medium'>{t('emptyTitle')}</Text>
                  <Text variant='muted' className='max-w-[16rem] text-xs leading-relaxed'>
                    {t('emptyDescription')}
                  </Text>
                </Flex>
              ) : null}

              {!isLoading && !isError
                ? notifications.map((notification) => {
                    const typeKey = getNotificationTypeKey(notification.type);
                    const typeLabel = tTypes(
                      `notificationType.${typeKey}` as 'notificationType.order_update'
                    );

                    return (
                      <button
                        key={notification.id}
                        type='button'
                        onClick={() => {
                          if (!notification.is_read) {
                            void markAsRead(notification.id);
                          }
                        }}
                        className={cn(
                          'border-border/40 hover:bg-muted/40 flex w-full flex-col gap-1.5 border-b px-4 py-3 text-left transition-colors',
                          !notification.is_read && 'bg-gold/5'
                        )}
                      >
                        <Flex align='start' justify='between' gap={2}>
                          <Text className='line-clamp-1 text-sm leading-snug font-medium'>
                            {notification.title}
                          </Text>
                          {!notification.is_read ? (
                            <span
                              className='bg-gold mt-1.5 size-2 shrink-0 rounded-full'
                              aria-hidden
                            />
                          ) : null}
                        </Flex>
                        <Text variant='muted' className='line-clamp-2 text-xs leading-relaxed'>
                          {notification.message}
                        </Text>
                        <Flex align='center' justify='between' gap={2} className='pt-0.5'>
                          <span
                            className={cn(
                              'inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase',
                              getNotificationTypeStyle(notification.type)
                            )}
                          >
                            {typeLabel}
                          </span>
                          <Text variant='muted' className='text-[10px] tabular-nums'>
                            {formatNotificationTime(notification.created_at)}
                          </Text>
                        </Flex>
                      </button>
                    );
                  })
                : null}
            </ScrollArea>

            <div className='border-border/60 bg-muted/10 border-t p-2'>
              <Button asChild variant='outline' size='sm' className='h-9 w-full rounded-xl'>
                <Link href='/notifications' onClick={() => setOpen(false)}>
                  {t('showMore')}
                  <IconChevronRight className='cn-rtl-flip ml-1 size-4' />
                </Link>
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
