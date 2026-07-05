'use client';

import { IconChevronUp, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';

import { CartMobileSummaryBody } from './cart-mobile-summary-body';

interface CartMobileCheckoutBarProps {
  total: number;
  itemCount: number;
  hasIncompleteVariants?: boolean;
  onCheckout: () => void;
}

/** Sticky cart bar above tab nav — tap total row to open order summary drawer. */
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
      <Flex
        direction='column'
        gap={0}
        className={cn(
          'bg-background/95 fixed inset-x-0 z-[55] rounded-t-2xl border-t shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl',
          'dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]',
          'bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden'
        )}
      >
        <button
          type='button'
          onClick={() => setSummaryOpen(true)}
          className='hover:bg-muted/40 flex w-full items-center gap-3 px-4 py-3.5 transition-colors active:scale-[0.995]'
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
            <Link
              href='/shop'
              className={cn(
                'border-border/60 bg-card text-foreground hover:border-gold/40 hover:bg-muted/60',
                'flex size-10 items-center justify-center rounded-full border transition-colors active:scale-95'
              )}
              aria-label={tMobile('addItems')}
            >
              <IconPlus className='size-5 shrink-0' aria-hidden />
            </Link>
            <Typography.Text className={cn(cartMoneyClassName, 'text-lg font-bold tabular-nums')}>
              {formatCartMoney(total)}
            </Typography.Text>
            <IconChevronUp className='text-muted-foreground size-4 shrink-0' aria-hidden />
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

      <Drawer open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DrawerContent
          variant='ios'
          radius='full'
          showHandle
          className='max-h-[min(88dvh,720px)] pb-[calc(7.5rem+env(safe-area-inset-bottom))]'
        >
          <Flex direction='column' align='start' gap={0.5} className='px-4 pt-1 pb-3 text-start'>
            <DrawerTitle className='text-base font-semibold'>{tMobile('viewSummary')}</DrawerTitle>
            <Typography.Muted className='text-xs'>
              {tMobile('itemCount', { count: itemCount })}
            </Typography.Muted>
          </Flex>
          <div className='max-h-[min(68dvh,600px)] overflow-y-auto px-4'>
            <CartMobileSummaryBody onNavigate={() => setSummaryOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
