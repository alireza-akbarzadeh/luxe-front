'use client';

import { IconChevronUp } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { MOBILE_TAB_BAR_BOTTOM_CLASS } from '@/lib/mobile-commerce-drawer';
import { cn } from '@/lib/utils';

import { CartMobileSummaryBody } from './cart-mobile-summary-body';

interface CartMobileCheckoutBarProps {
  total: number;
  itemCount: number;
  hasIncompleteVariants?: boolean;
  onCheckout: () => void;
}

/** Native fixed summary + checkout CTA above the mobile bottom tab bar. */
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
        <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
          <CollapsibleContent className='border-border/60 max-h-[min(50dvh,20rem)] overflow-y-auto overscroll-contain border-b px-4 pt-3 pb-2'>
            <Typography.H3 className='mb-3 text-base font-semibold'>
              {tMobile('viewSummary')}
            </Typography.H3>
            <CartMobileSummaryBody showItems showTotals />
          </CollapsibleContent>

          <button
            type='button'
            onClick={() => setSummaryOpen((open) => !open)}
            className='hover:bg-muted/40 flex w-full items-center gap-3 px-4 py-3 transition-colors active:scale-[0.995]'
            aria-expanded={summaryOpen}
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
              <IconChevronUp
                className={cn(
                  'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                  summaryOpen && 'rotate-180'
                )}
                aria-hidden
              />
            </Flex>
          </button>
        </Collapsible>

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
  );
}
