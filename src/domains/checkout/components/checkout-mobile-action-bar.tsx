'use client';

import { IconChevronLeft, IconChevronRight, IconChevronUp } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { MOBILE_TAB_BAR_BOTTOM_CLASS } from '@/lib/mobile-commerce-drawer';
import { cn } from '@/lib/utils';

import type { CheckoutMobileActionBarProps } from '../types/checkout.types';
import { CheckoutMobileSummaryBody } from './checkout-mobile-summary-body';

/** Native fixed checkout CTA with summary drawer layered above the action bar. */
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
  const tSummary = useTranslations('checkout.summary');
  const [summaryOpen, setSummaryOpen] = useState(false);

  const backLabel = isFirst ? t('backToCart') : t('backToShipping');

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
          <Flex direction='column' className='flex min-h-0 flex-1 flex-col overflow-hidden'>
            <Flex
              direction='column'
              align='start'
              gap={0.5}
              className='shrink-0 pt-1 pb-3 text-start'
            >
              <DrawerTitle className='text-base font-semibold'>{tSummary('title')}</DrawerTitle>
              <Typography.Muted className='text-xs'>
                {tMobile('itemCount', { count: itemCount })}
              </Typography.Muted>
            </Flex>
            <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2'>
              <CheckoutMobileSummaryBody showItems showCoupons showTotals />
            </div>
          </Flex>
        </DrawerContent>
      </Drawer>

      <div
        className={cn('fixed inset-x-0 z-[60] lg:hidden', MOBILE_TAB_BAR_BOTTOM_CLASS)}
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

          <Flex direction='column' gap={2} className='border-border/50 border-t px-4 pt-3 pb-3'>
            {!isFirst ? (
              <button
                type='button'
                onClick={onBack}
                disabled={isPending}
                className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 self-start text-sm font-medium transition-colors disabled:opacity-50'
              >
                <IconChevronLeft className='size-4 shrink-0' aria-hidden />
                {backLabel}
              </button>
            ) : null}

            {isLast ? (
              <>
                {!agreedToTerms ? (
                  <Typography.Muted className='text-destructive text-xs leading-relaxed'>
                    {tValidation('acceptTerms')}
                  </Typography.Muted>
                ) : null}
                <Button
                  type='button'
                  size='lg'
                  className={cn(
                    'bg-primary text-primary-foreground h-14 w-full rounded-2xl text-base font-semibold shadow-md active:scale-[0.98]',
                    !agreedToTerms && !isPending && 'opacity-70'
                  )}
                  loading={isPending}
                  disabled={isPending}
                  onClick={onPlaceOrder}
                >
                  {isPending
                    ? t('placingOrder')
                    : t('placeOrder', { total: formatCartMoney(total) })}
                </Button>
              </>
            ) : (
              <Button
                type='button'
                size='lg'
                className='bg-primary text-primary-foreground h-14 w-full rounded-2xl text-base font-semibold shadow-md active:scale-[0.98]'
                onClick={onNext}
                disabled={isPending}
              >
                {t('continueToReview')}
                <IconChevronRight className='ms-2 size-5 shrink-0' />
              </Button>
            )}

            {isFirst ? (
              <button
                type='button'
                onClick={onBack}
                disabled={isPending}
                className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 self-center text-sm font-medium transition-colors disabled:opacity-50'
              >
                <IconChevronLeft className='size-4 shrink-0' aria-hidden />
                {backLabel}
              </button>
            ) : null}
          </Flex>
        </Flex>
      </div>
    </>
  );
}
