'use client';

import { IconCheck, IconTag, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { formatCartMoney } from '@/domains/cart/lib/cart-utils';

import { useCheckoutSummaryCoupons } from '../hooks/use-checkout-summary-coupons';
import { AvailableCoupons } from './available-coupons';

/** Coupon input + applied state + available offers — lives in the order summary sidebar. */
export function CheckoutSummaryCoupons() {
  const t = useTranslations('checkout.summary');
  const {
    applicableCoupons,
    couponsLoading,
    appliedCouponCode,
    couponCode,
    couponDiscount,
    couponError,
    isApplyingCoupon,
    isApplied,
    isDuplicate,
    trimmedCode,
    handleApply,
    handleClear,
    handleKeyDown,
    setCouponInput
  } = useCheckoutSummaryCoupons();

  return (
    <Flex direction='column' spacing={3} className='border-border/60 border-t pt-4'>
      <Flex direction='row' align='center' justify='between'>
        <Typography.Text variant='small'>{t('promotions')}</Typography.Text>
        {!couponsLoading && applicableCoupons.length > 0 ? (
          <Typography.Text variant='subtle'>
            {t('offersAvailable', { count: applicableCoupons.length })}
          </Typography.Text>
        ) : null}
      </Flex>

      <AnimatePresence mode='wait'>
        {isApplied ? (
          <motion.div
            key='applied'
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className='bg-accent/8 border-accent/25 flex items-center gap-2 rounded-xl border px-3 py-2.5'
          >
            <span className='bg-accent/15 flex h-7 w-7 shrink-0 items-center justify-center rounded-full'>
              <IconCheck className='text-accent h-4 w-4' stroke={2.5} />
            </span>
            <Flex direction='column' className='min-w-0 flex-1'>
              <Typography.Text variant='small' className='font-mono tracking-wide'>
                {appliedCouponCode}
              </Typography.Text>
              <Typography.Text variant='subtle' tone='success'>
                {t('saved', { amount: formatCartMoney(couponDiscount) })}
              </Typography.Text>
            </Flex>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleClear}
              disabled={isApplyingCoupon}
              aria-label={t('removeCoupon')}
              className='text-muted-foreground hover:text-foreground shrink-0'
            >
              <IconX className='h-4 w-4' />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key='input'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Flex direction='row' spacing={2} align='stretch'>
              <div className='relative min-w-0 flex-1'>
                <IconTag className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  value={couponCode}
                  onChange={(event) => setCouponInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('couponPlaceholder')}
                  disabled={isApplyingCoupon}
                  className='h-10 rounded-xl pl-9 text-sm'
                  aria-label={t('couponPlaceholder')}
                />
              </div>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleApply()}
                disabled={!trimmedCode || isDuplicate || isApplyingCoupon}
                loading={isApplyingCoupon}
                className='h-10 shrink-0 rounded-xl px-4'
              >
                {t('apply')}
              </Button>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>

      {couponError ? (
        <Typography.Text variant='subtle' tone='destructive' role='alert'>
          {couponError}
        </Typography.Text>
      ) : null}

      {!couponsLoading && applicableCoupons.length > 0 ? (
        <AvailableCoupons
          variant='compact'
          applicableCoupons={applicableCoupons}
          selectedCouponCode={appliedCouponCode}
          isApplyingCoupon={isApplyingCoupon}
          onSelectCoupon={handleApply}
        />
      ) : null}
    </Flex>
  );
}
