'use client';

import { IconShoppingBag } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

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
        'group relative rounded-full transition-all duration-300',
        'hover:bg-primary/10 hover:scale-105 active:scale-95',
        showLabel ? 'gap-2 px-4' : 'h-9 w-9 p-0'
      )}
      aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
    >
      <IconShoppingBag className='h-5 w-5 transition-transform group-hover:rotate-3' />

      {showLabel && <span className='hidden text-sm font-medium sm:inline-block'>Cart</span>}

      <AnimatePresence mode='popLayout'>
        {itemCount > 0 && (
          <motion.span
            layout
            className={cn(
              'bg-accent text-accent-foreground absolute flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm',
              showLabel
                ? '-top-1 -right-1 h-5 min-w-5 px-1'
                : '-top-0.5 -right-0.5 h-4 min-w-4 px-0.5'
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
        )}
      </AnimatePresence>
    </Button>
  );
}
