'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';

interface CartMobileCheckoutBarProps {
  total: number;
  itemCount: number;
  hasIncompleteVariants?: boolean;
  onCheckout: () => void;
}

export function CartMobileCheckoutBar({
  total,
  itemCount,
  hasIncompleteVariants = false,
  onCheckout
}: CartMobileCheckoutBarProps) {
  const t = useTranslations('cart.page');
  const disabled = itemCount === 0 || hasIncompleteVariants;

  return (
    <Flex
      direction='column'
      spacing={2}
      className='bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur-md lg:hidden'
    >
      {hasIncompleteVariants ? (
        <Typography.Text variant='subtle' tone='warning' className='text-center text-xs'>
          {t('variantWarning')}
        </Typography.Text>
      ) : null}
      <Flex direction='row' align='center' spacing={3} className='mx-auto w-full max-w-7xl'>
        <Flex direction='column' spacing={0.5} className='min-w-0 flex-1'>
          <Typography.Text variant='subtle'>
            {t('itemCount', { count: itemCount })}
          </Typography.Text>
          <Typography.Text variant='large' className={cn(cartMoneyClassName, 'font-semibold')}>
            {formatCartMoney(total)}
          </Typography.Text>
        </Flex>
        <Button
          type='button'
          className='h-11 min-w-0 flex-1 rounded-full px-4 sm:flex-none sm:px-6'
          size='lg'
          disabled={disabled}
          onClick={onCheckout}
        >
          {t('checkout')}
          <IconArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </Flex>
    </Flex>
  );
}
