'use client';

import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { IconShoppingBag } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '~/src/store/card.store';
import { useCartController } from '@/hooks/useCartController';

interface CartButtonProps {
  showLabel?: boolean;
}

export function CartButton({ showLabel = false }: CartButtonProps) {
  const { itemCount } = useCartController();
  const setOpen = useCartStore((state) => state.setOpen);

  return (
    <div className='group relative' onClick={() => setOpen(true)}>
      <Button
        variant='ghost'
        size={showLabel ? 'default' : 'icon'}
        className={cn(
          'relative rounded-full transition-all duration-300',
          'hover:bg-primary/10 hover:scale-105 active:scale-95',
          showLabel ? 'gap-2 px-4' : 'h-9 w-9 p-0'
        )}
        type='button'
      >
        <IconShoppingBag className='h-5 w-5 transition-transform group-hover:rotate-3' />

        {showLabel && <span className='hidden text-sm font-medium sm:inline-block'>Cart</span>}

        <AnimatePresence mode='popLayout'>
          {itemCount > 0 && (
            <motion.span
              layout
              className={cn(
                'text-primary-foreground absolute flex items-center justify-center rounded-full bg-orange-400 text-[10px] font-bold shadow-sm',
                showLabel
                  ? '-top-1 -right-1 h-5 min-w-5 px-1'
                  : '-top-0.5 -right-0.5 h-4 min-w-4 px-0.5'
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {/* Animated number text – key triggers bounce on change */}
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
    </div>
  );
}
