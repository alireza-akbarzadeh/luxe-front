'use client';

import { IconHeart } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { navbarActionButtonClassName } from '@/components/navbar/navbar-action-button';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/domains/wishlist/wishlist.store';
import { cn } from '@/lib/utils';
import { useGetAccountSummary } from '~/src/services/-account-summary-get';

export function WishlistButton() {
  const t = useTranslations('common');
  const { isAuthenticated } = useAuth();
  const openSheet = useWishlistStore((state) => state.openSheet);
  const { data: summaryResponse } = useGetAccountSummary({
    query: { enabled: isAuthenticated }
  });

  const itemCount = summaryResponse?.data?.liked_products_count ?? 0;
  const ariaLabel =
    itemCount > 0 ? t('openWishlistWithCount', { count: itemCount }) : t('openWishlist');

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      onClick={openSheet}
      className={cn(navbarActionButtonClassName, 'relative')}
      aria-label={ariaLabel}
    >
      <IconHeart className='size-5' stroke={1.75} />
      <AnimatePresence mode='popLayout'>
        {isAuthenticated && itemCount > 0 ? (
          <motion.span
            layout
            className='bg-gold text-gold-foreground ring-background absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold shadow-sm ring-2'
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </Button>
  );
}
