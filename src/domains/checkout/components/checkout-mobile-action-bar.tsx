'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';

import type { CheckoutStepId } from '../checkout.schema';

interface CheckoutMobileActionBarProps {
  total: number;
  itemCount: number;
  currentStepId: CheckoutStepId;
  isFirst: boolean;
  isLast: boolean;
  isPending: boolean;
  agreedToTerms: boolean;
  onBack: () => void;
  onNext: () => void;
  onPlaceOrder: () => void;
}

/** Sticky checkout actions above the mobile bottom tab bar. */
export function CheckoutMobileActionBar({
  total,
  itemCount,
  currentStepId,
  isFirst,
  isLast,
  isPending,
  agreedToTerms,
  onBack,
  onNext,
  onPlaceOrder
}: CheckoutMobileActionBarProps) {
  const t = useTranslations('checkout.navigation');
  const tMobile = useTranslations('checkout.mobileSummary');

  return (
    <Flex
      direction='column'
      gap={3}
      className={cn(
        'bg-background/95 fixed inset-x-0 z-[55] border-t p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl',
        'bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden'
      )}
    >
      <Flex align='center' justify='between' className='w-full'>
        <Flex direction='column' gap={0.5}>
          <Typography.Muted className='text-xs'>
            {tMobile('itemCount', { count: itemCount })}
          </Typography.Muted>
          <Typography.Text className={cn(cartMoneyClassName, 'text-xl font-semibold')}>
            {formatCartMoney(total)}
          </Typography.Text>
        </Flex>
      </Flex>

      <Flex align='center' gap={2} className='w-full'>
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='size-12 shrink-0 rounded-full px-0'
          onClick={onBack}
          disabled={isPending}
          aria-label={isFirst ? t('backToCart') : t('backToShipping')}
        >
          <IconChevronLeft className='size-5' />
        </Button>

        {isLast ? (
          <Button
            type='button'
            size='lg'
            className='bg-accent text-accent-foreground h-12 min-w-0 flex-1 rounded-full text-base font-semibold'
            loading={isPending}
            disabled={!agreedToTerms || isPending}
            onClick={onPlaceOrder}
          >
            {isPending ? t('placingOrder') : t('placeOrder', { total: formatCartMoney(total) })}
          </Button>
        ) : (
          <Button
            type='button'
            size='lg'
            className='bg-accent text-accent-foreground h-12 min-w-0 flex-1 rounded-full text-base font-semibold'
            onClick={onNext}
            disabled={isPending}
          >
            {currentStepId === 'shipping' ? t('continueToReview') : t('continueToReview')}
            <IconChevronRight className='ms-2 size-5' />
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
