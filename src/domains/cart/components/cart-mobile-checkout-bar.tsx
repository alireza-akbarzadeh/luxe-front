'use client';

import { IconPlus } from '@tabler/icons-react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import {
  PDP_MOBILE_SHEET_RADIUS_CLASS,
  PDP_MOBILE_SHEET_SHADOW_CLASS,
  PDP_MOBILE_TAB_BAR_OFFSET
} from '@/domains/product/lib/product-detail-mobile';
import { cn } from '@/lib/utils';

import { CartAddItemsSearchDrawer } from './cart-add-items-search-drawer';
import { CartMobileSummaryBody } from './cart-mobile-summary-body';

interface CartMobileCheckoutBarProps {
  total: number;
  itemCount: number;
  hasIncompleteVariants?: boolean;
  onCheckout: () => void;
}

const mobileSheetClassName = cn(
  'bg-background/95 border-border/80 border-t backdrop-blur-xl',
  PDP_MOBILE_SHEET_RADIUS_CLASS,
  PDP_MOBILE_SHEET_SHADOW_CLASS
);

/** PDP-style draggable cart commerce sheet — totals summary + inline add-items search. */
export function CartMobileCheckoutBar({
  total,
  itemCount,
  hasIncompleteVariants = false,
  onCheckout
}: CartMobileCheckoutBarProps) {
  const t = useTranslations('cart.page');
  const tMobile = useTranslations('cart.mobileSummary');
  const [expanded, setExpanded] = useState(false);
  const [addItemsOpen, setAddItemsOpen] = useState(false);
  const disabled = itemCount === 0 || hasIncompleteVariants;

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
    <>
      <CartAddItemsSearchDrawer open={addItemsOpen} onOpenChange={setAddItemsOpen} />

      <motion.div
        className={cn('fixed inset-x-0 z-[45] overflow-hidden lg:hidden', mobileSheetClassName)}
        style={{ bottom: PDP_MOBILE_TAB_BAR_OFFSET }}
        role='region'
        aria-label={tMobile('viewSummary')}
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
            aria-label={expanded ? tMobile('collapseSummary') : tMobile('showSummary')}
          >
            <span className='bg-muted-foreground/35 h-1 w-10 rounded-full' aria-hidden />
            <Typography.Muted className='text-[10px] font-medium tracking-wide uppercase'>
              {expanded ? tMobile('collapseSummary') : tMobile('dragHint')}
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
                  <CartMobileSummaryBody showItems={false} showTotals />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Flex
            direction='column'
            gap={2}
            className={cn('shrink-0 px-4 pt-2 pb-3.5', expanded && 'border-border/50 border-t')}
          >
            <Flex direction='row' align='center' justify='between' className='min-w-0 gap-3'>
              <Flex direction='column' align='start' gap={0.5} className='min-w-0'>
                <Typography.Muted className='text-[11px] font-medium tracking-wide uppercase'>
                  {tMobile('totalLabel')}
                </Typography.Muted>
                <Typography.Text
                  className={cn('text-xl font-bold tabular-nums', cartMoneyClassName)}
                >
                  {formatCartMoney(total)}
                </Typography.Text>
              </Flex>
              <Typography.Muted className='text-xs tabular-nums'>
                {tMobile('itemCount', { count: itemCount })}
              </Typography.Muted>
            </Flex>

            {hasIncompleteVariants ? (
              <Typography.Muted className='text-warning text-xs leading-relaxed'>
                {t('variantWarning')}
              </Typography.Muted>
            ) : null}

            <Flex direction='row' gap={2} className='w-full'>
              <Button
                type='button'
                variant='outline'
                size='lg'
                className='border-gold/35 hover:border-gold/55 h-14 flex-1 rounded-2xl border-dashed text-sm font-semibold'
                onClick={() => setAddItemsOpen(true)}
              >
                <IconPlus className='me-1.5 h-4 w-4 shrink-0' aria-hidden />
                {tMobile('addItems')}
              </Button>
              <Button
                type='button'
                size='lg'
                className={cn(
                  'bg-primary text-primary-foreground h-14 flex-[1.35] rounded-2xl text-base font-semibold shadow-md active:scale-[0.98]',
                  disabled && 'opacity-70'
                )}
                disabled={disabled}
                onClick={onCheckout}
              >
                {t('proceedToCheckout')}
              </Button>
            </Flex>
          </Flex>
        </motion.div>
      </motion.div>
    </>
  );
}
