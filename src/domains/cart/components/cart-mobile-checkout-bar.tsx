'use client';

import { IconChevronUp } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import {
  MOBILE_COMMERCE_SUMMARY_SCROLL_MAX_HEIGHT_CLASS,
  MOBILE_TAB_BAR_BOTTOM_CLASS
} from '@/lib/mobile-commerce-drawer';
import { cn } from '@/lib/utils';

import { CartMobileSummaryBody } from './cart-mobile-summary-body';

interface CartMobileCheckoutBarProps {
  total: number;
  itemCount: number;
  hasIncompleteVariants?: boolean;
  onCheckout: () => void;
}

/** Native fixed checkout CTA with summary drawer layered above the action bar. */
export function CartMobileCheckoutBar({
  total,
  itemCount,
  hasIncompleteVariants = false,
  onCheckout
}: CartMobileCheckoutBarProps) {
  const t = useTranslations('cart.page');
  const tMobile = useTranslations('cart.mobileSummary');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const disabled = itemCount === 0 || hasIncompleteVariants;

  return (
    <>
      <Drawer open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DrawerContent
          aboveCommerceActionBar
          variant='ios'
          radius='full'
          showHandle
          className='lg:hidden'
        >
          <Flex direction='column' className='min-h-0 overflow-hidden'>
            <DrawerTitle className='mb-3 shrink-0 text-base font-semibold'>
              {tMobile('viewSummary')}
            </DrawerTitle>
            <div
              className={cn(
                'min-h-0 overflow-y-auto overscroll-contain pb-2',
                MOBILE_COMMERCE_SUMMARY_SCROLL_MAX_HEIGHT_CLASS
              )}
            >
              <CartMobileSummaryBody showItems showTotals />
            </div>
          </Flex>
        </DrawerContent>
      </Drawer>

      <div
        className={cn(
          'fixed inset-x-0 lg:hidden',
          MOBILE_TAB_BAR_BOTTOM_CLASS,
          summaryOpen ? 'z-[72]' : 'z-[60]'
        )}
        role='region'
        aria-label={tMobile('viewSummary')}
      >
        <Flex
          direction='column'
          className={cn(
            'border-border/80 bg-background/95 border-t shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl',
            'dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]'
          )}
        >
          <button
            type='button'
            onClick={() => setSummaryOpen(true)}
            className='hover:bg-muted/40 flex w-full items-center gap-3 px-4 py-3 transition-colors active:scale-[0.995]'
            aria-expanded={summaryOpen}
            aria-haspopup='dialog'
            aria-label={tMobile('showSummary')}
          >
            <Flex direction='column' align='start' gap={0.5} className='min-w-0 flex-1 text-start'>
              <Typography.Small weight='semibold'>{tMobile('viewSummary')}</Typography.Small>
              <Typography.Muted className='text-xs'>
                {tMobile('itemCount', { count: itemCount })}
              </Typography.Muted>
            </Flex>
            <Flex direction='row' align='center' gap={1.5} className='shrink-0'>
              <Typography.Text className={cn(cartMoneyClassName, 'text-lg font-bold tabular-nums')}>
                {formatCartMoney(total)}
              </Typography.Text>
              <IconChevronUp className='text-muted-foreground size-4 shrink-0' aria-hidden />
            </Flex>
          </button>

          <Flex direction='column' gap={2} className='px-4 pt-3 pb-3'>
            {hasIncompleteVariants ? (
              <Typography.Muted className='text-warning text-xs leading-relaxed'>
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
            <Button asChild variant='ghost' size='sm' className='text-muted-foreground h-9 text-xs'>
              <Link href='/shop'>{t('continueShopping')}</Link>
            </Button>
          </Flex>
        </Flex>
      </div>
    </>
  );
}
