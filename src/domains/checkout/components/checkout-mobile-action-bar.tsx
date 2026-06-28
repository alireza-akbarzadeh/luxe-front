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

/** Sticky primary actions on mobile — keeps checkout one-thumb friendly. */
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
      spacing={0}
      className='bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur-md lg:hidden'
    >
      <Flex direction='row' align='center' justify='between' className='mb-3'>
        <Typography.Text variant='subtle'>
          {tMobile('itemCount', { count: itemCount })}
        </Typography.Text>
        <Typography.Text variant='large' className={cn(cartMoneyClassName, 'font-semibold')}>
          {formatCartMoney(total)}
        </Typography.Text>
      </Flex>

      <Flex direction='row' align='center' spacing={2}>
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='h-11 shrink-0 rounded-full px-4'
          onClick={onBack}
          disabled={isPending}
        >
          <IconChevronLeft className='h-4 w-4' />
          <span className='sr-only'>{isFirst ? t('backToCart') : t('backToShipping')}</span>
        </Button>

        {isLast ? (
          <Button
            type='button'
            size='lg'
            className='bg-accent text-accent-foreground h-11 min-w-0 flex-1 rounded-full'
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
            className='bg-accent text-accent-foreground h-11 min-w-0 flex-1 rounded-full'
            onClick={onNext}
            disabled={isPending}
          >
            {currentStepId === 'shipping' ? t('continueToReview') : t('continueToReview')}
            <IconChevronRight className='ml-2 h-4 w-4' />
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
