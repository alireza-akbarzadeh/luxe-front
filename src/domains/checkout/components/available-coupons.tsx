'use client';

import { IconCheck, IconTicket } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { ModelsCoupon } from '@/services/-coupons-get.schemas';

interface AvailableCouponsProps {
  applicableCoupons: ModelsCoupon[];
  selectedCouponCode: string;
  isApplyingCoupon: boolean;
  onSelectCoupon: (code: string) => void;
  variant?: 'default' | 'compact';
}

function formatDiscountLabel(coupon: ModelsCoupon) {
  if (coupon.discount_type === 'percentage') {
    return `${coupon.discount_value}% off`;
  }
  return `$${coupon.discount_value} off`;
}

export function AvailableCoupons({
  applicableCoupons,
  selectedCouponCode,
  isApplyingCoupon,
  onSelectCoupon,
  variant = 'default'
}: AvailableCouponsProps) {
  const t = useTranslations('checkout.summary');

  if (!applicableCoupons.length) return null;

  const isCompact = variant === 'compact';

  return (
    <Accordion type='single' collapsible className='w-full'>
      <AccordionItem value='coupons' className='border-none'>
        <AccordionTrigger className='text-muted-foreground hover:text-foreground py-2 text-xs font-medium hover:no-underline'>
          {t('browseOffers', { count: applicableCoupons.length })}
        </AccordionTrigger>
        <AccordionContent className='pb-1'>
          <Flex
            direction='column'
            spacing={2}
            className={cn(!isCompact && 'sm:grid sm:grid-cols-2 sm:gap-2')}
          >
            {applicableCoupons.map((coupon) => {
              const isSelected = selectedCouponCode === coupon.code;

              return (
                <button
                  key={coupon.id}
                  type='button'
                  onClick={() => {
                    if (isSelected || isApplyingCoupon) return;
                    onSelectCoupon(coupon.code ?? '');
                  }}
                  disabled={isApplyingCoupon || isSelected}
                  className={cn(
                    'flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition-colors',
                    isSelected
                      ? 'border-accent/40 bg-accent/8 ring-accent/15 ring-1'
                      : 'border-border/70 bg-muted/30 hover:border-accent/30 hover:bg-muted/50',
                    isApplyingCoupon && 'cursor-not-allowed opacity-60'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                      isSelected
                        ? 'bg-accent/15 text-accent'
                        : 'bg-background text-muted-foreground'
                    )}
                  >
                    {isSelected ? (
                      <IconCheck className='h-3.5 w-3.5' stroke={2.5} />
                    ) : (
                      <IconTicket className='h-3.5 w-3.5' />
                    )}
                  </span>
                  <Flex direction='column' spacing={0.5} className='min-w-0 flex-1'>
                    <Flex direction='row' align='center' justify='between' spacing={2}>
                      <Typography.Text variant='small' className='font-mono'>
                        {coupon.code}
                      </Typography.Text>
                      <Typography.Text
                        variant='subtle'
                        tone='success'
                        className='shrink-0 font-medium'
                      >
                        {formatDiscountLabel(coupon)}
                      </Typography.Text>
                    </Flex>
                    <Typography.Text variant='subtle' className='line-clamp-2'>
                      {coupon.description ||
                        t('minOrder', { amount: coupon.minimum_order_amount ?? 0 })}
                    </Typography.Text>
                  </Flex>
                </button>
              );
            })}
          </Flex>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
