'use client';

import { IconMinus, IconPlus } from '@tabler/icons-react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import {
  PDP_MOBILE_SHEET_RADIUS_CLASS,
  PDP_MOBILE_SHEET_SHADOW_CLASS,
  PDP_MOBILE_TAB_BAR_OFFSET
} from '../../lib/product-detail-mobile';
import { ProductMobileSheetSummary } from './product-mobile-sheet-summary';

interface ProductMobileActionBarProps {
  product: DtoProductWithLike;
  price: number;
  subtotal: number;
  productQuantity: number;
  stock: number;
  isLoading: boolean;
  isOutOfStock: boolean;
  isLowStock: boolean;
  onAddToCart: () => void;
  onDecrement: () => void;
}

const TAB_BAR_OFFSET = PDP_MOBILE_TAB_BAR_OFFSET;

const mobileSheetClassName = cn(
  'bg-background/95 border-border/80 border-t backdrop-blur-xl',
  PDP_MOBILE_SHEET_RADIUS_CLASS,
  PDP_MOBILE_SHEET_SHADOW_CLASS
);

/** Draggable native-style PDP commerce sheet — price, summary peek, and cart controls. */
export function ProductMobileActionBar({
  product,
  price,
  subtotal,
  productQuantity,
  stock,
  isLoading,
  isOutOfStock,
  isLowStock,
  onAddToCart,
  onDecrement
}: ProductMobileActionBarProps) {
  const tCard = useTranslations('shop.productCard');
  const tQty = useTranslations('pdp.quantity');
  const tSheet = useTranslations('pdp.mobileSheet');
  const { formatPrice, formatInteger, moneyClassName } = useLocaleFormatters();
  const [expanded, setExpanded] = useState(false);
  const inCart = productQuantity > 0;
  const isMaxReached = productQuantity >= stock;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -48 || info.velocity.y < -450) {
      setExpanded(true);
      return;
    }
    if (info.offset.y > 48 || info.velocity.y > 450) {
      setExpanded(false);
    }
  };

  return (
    <motion.div
      className={cn('fixed inset-x-0 z-[45] overflow-hidden lg:hidden', mobileSheetClassName)}
      style={{ bottom: TAB_BAR_OFFSET }}
    >
      <motion.div
        drag='y'
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
        className='flex min-h-0 flex-col'
      >
        <button
          type='button'
          onClick={() => setExpanded((current) => !current)}
          className='flex w-full shrink-0 flex-col items-center gap-1 px-4 pt-2.5 pb-1'
          aria-expanded={expanded}
          aria-label={expanded ? tSheet('collapseDetails') : tSheet('expandDetails')}
        >
          <span className='bg-muted-foreground/35 h-1 w-10 rounded-full' aria-hidden />
          <Typography.Muted className='text-[10px] font-medium tracking-wide uppercase'>
            {expanded ? tSheet('collapseDetails') : tSheet('dragHint')}
          </Typography.Muted>
        </button>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key='summary'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              className='min-h-0 overflow-hidden'
            >
              <div className='max-h-[min(52dvh,420px)] overflow-y-auto overscroll-contain px-4 pt-2 pb-3'>
                <ProductMobileSheetSummary
                  product={product}
                  subtotal={subtotal}
                  isOutOfStock={isOutOfStock}
                  isLowStock={isLowStock}
                  stock={stock}
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Flex
          direction='column'
          gap={0}
          className={cn('shrink-0', expanded && 'border-border/50 border-t')}
        >
          <Flex direction='row' align='center' justify='between' className='w-full px-4 py-3'>
            <Flex direction='column' align='start' gap={0.5} className='min-w-0'>
              <Typography.Muted className='text-[11px] font-medium tracking-wide uppercase'>
                {inCart ? tSheet('inCart') : tCard('addToCart')}
              </Typography.Muted>
              <Typography.Text className={cn('text-xl font-bold tabular-nums', moneyClassName)}>
                {formatPrice(price)}
              </Typography.Text>
            </Flex>

            {inCart ? (
              <Typography.Muted
                className={cn('text-sm font-semibold tabular-nums', moneyClassName)}
              >
                {tSheet('quantity', { count: formatInteger(productQuantity) })}
              </Typography.Muted>
            ) : null}
          </Flex>

          <Flex direction='column' className='w-full px-4 pt-1 pb-3.5'>
            {inCart ? (
              <Flex
                direction='row'
                align='center'
                justify='between'
                className='bg-muted/50 border-border/70 h-14 w-full rounded-2xl border px-1.5'
              >
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-11 w-11 shrink-0 rounded-xl'
                  onClick={onDecrement}
                  disabled={isLoading}
                  aria-label={tQty('decrease')}
                >
                  <IconMinus className='h-5 w-5' />
                </Button>
                <Typography.Text
                  className={cn(
                    'min-w-10 text-center text-lg font-semibold tabular-nums',
                    moneyClassName
                  )}
                >
                  {formatInteger(productQuantity)}
                </Typography.Text>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='bg-accent text-accent-foreground hover:bg-accent/90 h-11 w-11 shrink-0 rounded-xl'
                  onClick={onAddToCart}
                  disabled={isLoading || isMaxReached}
                  aria-label={tQty('increase')}
                >
                  <IconPlus className='h-5 w-5' />
                </Button>
              </Flex>
            ) : (
              <Button
                onClick={onAddToCart}
                size='lg'
                className='bg-accent text-accent-foreground hover:bg-accent/90 h-14 w-full rounded-2xl text-base font-semibold shadow-none active:scale-[0.98]'
                disabled={isLoading || isOutOfStock}
              >
                {isLoading ? tCard('adding') : isOutOfStock ? tCard('soldOut') : tCard('addToCart')}
              </Button>
            )}
          </Flex>
        </Flex>
      </motion.div>
    </motion.div>
  );
}
