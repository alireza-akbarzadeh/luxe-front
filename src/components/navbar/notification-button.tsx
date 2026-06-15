'use client';

import { IconBell } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import { navbarActionButtonClassName } from '@/components/navbar/navbar-action-button';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { useNotificationUnreadCount } from '@/domains/notifications/hooks/use-notification-unread-count';
import { cn } from '@/lib/utils';

export function NotificationButton() {
  const { isAuthenticated } = useAuth();
  const { data: unreadCount = 0 } = useNotificationUnreadCount();

  const href = isAuthenticated ? '/notifications' : '/login?callbackUrl=/notifications';

  return (
    <Button
      asChild
      variant='ghost'
      size='icon'
      className={cn(navbarActionButtonClassName, 'relative')}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      <Link href={href}>
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
      </Link>
    </Button>
  );
}
