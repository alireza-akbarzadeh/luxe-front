'use client';

import { IconShoppingBag } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { navbarActionButtonClassName } from '@/components/navbar/navbar-action-button';
import { Button } from '@/components/ui/button';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';
import { useCartStore } from '~/src/store/card.store';

interface CartButtonProps {
  showLabel?: boolean;
}

export function CartButton({ showLabel = false }: CartButtonProps) {
  const { itemCount } = useCartController();
  const openCart = useCartStore((state) => state.openCart);

  return (
    <Button
      type='button'
      variant='ghost'
      size={showLabel ? 'default' : 'icon'}
      onClick={openCart}
      className={cn(
        showLabel
          ? 'hover:bg-muted/70 gap-2 rounded-full px-4'
          : cn(navbarActionButtonClassName, 'relative'),
        showLabel && 'h-10'
      )}
      aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
    >
      <IconShoppingBag className='size-5' stroke={1.75} />

      {showLabel ? <span className='hidden text-sm font-medium sm:inline-block'>Cart</span> : null}

      <AnimatePresence mode='popLayout'>
        {itemCount > 0 ? (
          <motion.span
            layout
            className={cn(
              'bg-gold text-gold-foreground ring-background absolute flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm ring-2',
              showLabel
                ? '-top-0.5 -right-0.5 h-4 min-w-4 px-1'
                : 'top-1 right-1 h-4 min-w-4 px-0.5'
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <motion.span
              key={itemCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              {itemCount > 99 ? '99+' : itemCount}
            </motion.span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </Button>
  );
}
