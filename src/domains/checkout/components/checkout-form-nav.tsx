'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { formatCartMoney } from '@/domains/cart/lib/cart-utils';

import type { CheckoutStepId } from '../checkout.schema';

interface CheckoutFormNavProps {
  currentStepId: CheckoutStepId;
  isFirst: boolean;
  isLast: boolean;
  isPending: boolean;
  agreedToTerms: boolean;
  total: number;
  onBack: () => void;
  onNext: () => void;
  onPlaceOrder: () => void;
}

/** Desktop inline step navigation (hidden on mobile — use CheckoutMobileActionBar). */
export function CheckoutFormNav({
  currentStepId,
  isFirst,
  isLast,
  isPending,
  agreedToTerms,
  total,
  onBack,
  onNext,
  onPlaceOrder
}: CheckoutFormNavProps) {
  const router = useRouter();
  const t = useTranslations('checkout.navigation');

  return (
    <Flex direction='row' align='center' justify='between' className='hidden pt-6 lg:flex'>
      {isLast ? (
        <>
          <Button
            type='button'
            onClick={onBack}
            variant='link'
            disabled={isPending}
            className='px-6 py-4.5'
          >
            <IconChevronLeft className='mr-2 h-4 w-4' />
            {t('backToShipping')}
          </Button>
          <Button
            type='button'
            onClick={onPlaceOrder}
            loading={isPending}
            disabled={!agreedToTerms || isPending}
            aria-busy={isPending}
            className='bg-accent text-accent-foreground w-56 rounded-full py-4.5 hover:text-white'
          >
            {isPending ? t('placingOrder') : t('placeOrder', { total: formatCartMoney(total) })}
          </Button>
        </>
      ) : (
        <>
          <Button
            type='button'
            onClick={() => (isFirst ? router.push('/cart') : onBack())}
            variant='link'
            className='px-6 py-4.5'
          >
            <IconChevronLeft className='mr-2 h-4 w-4' />
            {currentStepId === 'shipping' ? t('backToCart') : t('backToShipping')}
          </Button>
          <Button
            type='button'
            onClick={onNext}
            className='bg-accent text-accent-foreground rounded-full px-6 py-4.5'
          >
            {t('continueToReview')}
            <IconChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </>
      )}
    </Flex>
  );
}
