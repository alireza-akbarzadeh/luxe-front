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

/** Sticky checkout CTA above the mobile bottom tab bar. */
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
      gap={2}
      className={cn(
        'bg-background/95 fixed inset-x-0 z-[55] border-t p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl',
        'bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden'
      )}
    >
      {hasIncompleteVariants ? (
        <Typography.Text
          variant='subtle'
          tone='warning'
          className='text-center text-xs leading-relaxed'
        >
          {t('variantWarning')}
        </Typography.Text>
      ) : null}

      <Flex align='center' justify='between' gap={3} className='w-full'>
        <Flex direction='column' gap={0.5} className='min-w-0 shrink-0'>
          <Typography.Muted className='text-xs'>{t('estimatedTotal')}</Typography.Muted>
          <Typography.Text className={cn(cartMoneyClassName, 'text-xl font-semibold')}>
            {formatCartMoney(total)}
          </Typography.Text>
          <Typography.Muted className='text-[11px]'>
            {t('itemCount', { count: itemCount })}
          </Typography.Muted>
        </Flex>
      </Flex>

      <Button
        type='button'
        className='h-12 w-full rounded-full text-base font-semibold'
        size='lg'
        disabled={disabled}
        onClick={onCheckout}
      >
        {t('proceedToCheckout')}
        <IconArrowRight className='ms-2 size-5' />
      </Button>
    </Flex>
  );
}
