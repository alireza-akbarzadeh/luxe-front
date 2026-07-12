'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
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

import type { CheckoutMobileActionBarProps } from '../types/checkout.types';
import { CheckoutMobileSummaryBody } from './checkout-mobile-summary-body';

const mobileSheetClassName = cn(
  'bg-background/95 border-border/80 border-t backdrop-blur-xl',
  PDP_MOBILE_SHEET_RADIUS_CLASS,
  PDP_MOBILE_SHEET_SHADOW_CLASS
);

/** PDP/cart-style draggable checkout commerce sheet. */
export function CheckoutMobileActionBar({
  total,
  itemCount,
  isFirst,
  isLast,
  isPending,
  agreedToTerms,
  onBack,
  onNext,
  onPlaceOrder
}: CheckoutMobileActionBarProps) {
  const t = useTranslations('checkout.navigation');
  const tValidation = useTranslations('checkout.validation');
  const tMobile = useTranslations('checkout.mobileSummary');
  const [expanded, setExpanded] = useState(false);

  const backLabel = isFirst ? t('backToCart') : t('backToShipping');

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
          aria-label={expanded ? tMobile('hideSummary') : tMobile('showSummary')}
        >
          <span className='bg-muted-foreground/35 h-1 w-10 rounded-full' aria-hidden />
          <Typography.Muted className='text-[10px] font-medium tracking-wide uppercase'>
            {expanded ? tMobile('hideSummary') : tMobile('dragForSummary')}
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
                <CheckoutMobileSummaryBody showItems={false} showCoupons showTotals />
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
              <Typography.Text className={cn('text-xl font-bold tabular-nums', cartMoneyClassName)}>
                {formatCartMoney(total)}
              </Typography.Text>
            </Flex>
            <Typography.Muted className='text-xs tabular-nums'>
              {tMobile('itemCount', { count: itemCount })}
            </Typography.Muted>
          </Flex>

          {isLast && !agreedToTerms ? (
            <Typography.Muted className='text-destructive text-xs leading-relaxed'>
              {tValidation('acceptTerms')}
            </Typography.Muted>
          ) : null}

          <Flex direction='row' gap={2} className='w-full'>
            <Button
              type='button'
              variant='outline'
              size='lg'
              className='h-14 shrink-0 rounded-2xl px-3'
              onClick={onBack}
              disabled={isPending}
              aria-label={backLabel}
            >
              <IconChevronLeft className='size-5' aria-hidden />
            </Button>

            {isLast ? (
              <Button
                type='button'
                size='lg'
                className={cn(
                  'bg-primary text-primary-foreground h-14 flex-1 rounded-2xl text-base font-semibold shadow-md active:scale-[0.98]',
                  !agreedToTerms && !isPending && 'opacity-70'
                )}
                loading={isPending}
                disabled={isPending}
                onClick={onPlaceOrder}
              >
                {isPending ? t('placingOrder') : t('placeOrder', { total: formatCartMoney(total) })}
              </Button>
            ) : (
              <Button
                type='button'
                size='lg'
                className='bg-primary text-primary-foreground h-14 flex-1 rounded-2xl text-base font-semibold shadow-md active:scale-[0.98]'
                onClick={onNext}
                disabled={isPending}
              >
                {t('continueToReview')}
                <IconChevronRight className='ms-1.5 size-5 shrink-0' aria-hidden />
              </Button>
            )}
          </Flex>
        </Flex>
      </motion.div>
    </motion.div>
  );
}
