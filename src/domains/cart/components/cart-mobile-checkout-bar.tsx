'use client';

import { IconChevronUp, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { CommerceSnapLevelDots } from '@/components/commerce-snap-level-dots';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import {
  COMMERCE_SNAP_COLLAPSED,
  COMMERCE_SNAP_FULL,
  COMMERCE_SNAP_MID,
  COMMERCE_SNAP_POINTS,
  nextCommerceSnapPoint
} from '@/lib/mobile-commerce-drawer';
import { cn } from '@/lib/utils';

import { CartMobileSummaryBody } from './cart-mobile-summary-body';

interface CartMobileCheckoutBarProps {
  total: number;
  itemCount: number;
  hasIncompleteVariants?: boolean;
  onCheckout: () => void;
}

/** Persistent snap drawer above tab nav — drag up through 3 levels instead of a second modal. */
export function CartMobileCheckoutBar({
  total,
  itemCount,
  hasIncompleteVariants = false,
  onCheckout
}: CartMobileCheckoutBarProps) {
  const t = useTranslations('cart.page');
  const tMobile = useTranslations('cart.mobileSummary');
  const [snap, setSnap] = useState<number | string | null>(COMMERCE_SNAP_COLLAPSED);
  const disabled = itemCount === 0 || hasIncompleteVariants;

  const activeIndex = COMMERCE_SNAP_POINTS.findIndex((point) => point === snap);
  const isCollapsed = snap === COMMERCE_SNAP_COLLAPSED;
  const isFull = snap === COMMERCE_SNAP_FULL;

  const expandSnap = () => {
    setSnap((current) => nextCommerceSnapPoint(current));
  };

  return (
    <div className='lg:hidden'>
      <Drawer
        open
        modal={false}
        dismissible={false}
        snapPoints={[...COMMERCE_SNAP_POINTS]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        snapToSequentialPoint
        fadeFromIndex={1}
      >
        <DrawerContent
          aboveMobileTabBar
          variant='ios'
          radius='full'
          showHandle
          className={cn(
            'border-border/80 z-[55] max-h-[calc(97dvh-4rem-env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]',
            'dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]'
          )}
        >
          <div
            className={cn(
              'flex min-h-0 flex-1 flex-col',
              isFull ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'
            )}
          >
            {!isCollapsed ? (
              <div className='px-4 pb-2'>
                <Flex direction='column' align='start' gap={0.5} className='pt-1 pb-3 text-start'>
                  <DrawerTitle className='text-base font-semibold'>
                    {tMobile('viewSummary')}
                  </DrawerTitle>
                  <Typography.Muted className='text-xs'>
                    {tMobile('itemCount', { count: itemCount })}
                  </Typography.Muted>
                </Flex>
                <CartMobileSummaryBody
                  showItems={isFull}
                  showTotals={snap === COMMERCE_SNAP_MID || isFull}
                />
              </div>
            ) : null}

            <Flex direction='column' gap={0} className='bg-background mt-auto shrink-0 border-t'>
              <CommerceSnapLevelDots activeIndex={activeIndex < 0 ? 0 : activeIndex} />

              <button
                type='button'
                onClick={expandSnap}
                className='hover:bg-muted/40 flex w-full items-center gap-3 px-4 py-3 transition-colors active:scale-[0.995]'
                aria-expanded={!isCollapsed}
                aria-label={tMobile('showSummary')}
              >
                <Flex
                  direction='column'
                  align='start'
                  gap={0.5}
                  className='min-w-0 flex-1 text-start'
                >
                  <Typography.Small weight='semibold'>{tMobile('viewSummary')}</Typography.Small>
                  <Typography.Muted className='text-xs'>
                    {tMobile('itemCount', { count: itemCount })}
                  </Typography.Muted>
                </Flex>
                <Flex direction='row' align='center' gap={1.5} className='shrink-0'>
                  <Link
                    href='/shop'
                    className={cn(
                      'border-border/60 bg-card text-foreground hover:border-gold/40 hover:bg-muted/60',
                      'flex size-10 items-center justify-center rounded-full border transition-colors active:scale-95'
                    )}
                    aria-label={tMobile('addItems')}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <IconPlus className='size-5 shrink-0' aria-hidden />
                  </Link>
                  <Typography.Text
                    className={cn(cartMoneyClassName, 'text-lg font-bold tabular-nums')}
                  >
                    {formatCartMoney(total)}
                  </Typography.Text>
                  <IconChevronUp
                    className={cn(
                      'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                      !isCollapsed && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </Flex>
              </button>

              <Flex
                direction='column'
                gap={2}
                className='border-border/50 w-full border-t px-4 pt-3 pb-3.5'
              >
                {hasIncompleteVariants ? (
                  <Typography.Muted className='text-warning px-0.5 text-xs leading-relaxed'>
                    {t('variantWarning')}
                  </Typography.Muted>
                ) : null}
                <Button
                  type='button'
                  size='lg'
                  className={cn(
                    'bg-primary text-primary-foreground h-14 w-full rounded-2xl text-base font-semibold shadow-md active:scale-[0.98]',
                    disabled && 'opacity-70'
                  )}
                  disabled={disabled}
                  onClick={onCheckout}
                >
                  {t('proceedToCheckout')}
                </Button>
              </Flex>
            </Flex>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
