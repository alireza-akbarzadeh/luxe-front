'use client';

import { IconArrowRight, IconHeart, IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { BackgroundGradient } from '@/components/effects/background-gradient';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

interface OrderConfirmedActionsProps {
  orderId: number;
  showRefreshPayment: boolean;
  confirmError?: string;
  onRefreshPayment: () => void;
}

/** Primary CTAs and closing message on the order confirmed page. */
export function OrderConfirmedActions({
  orderId,
  showRefreshPayment,
  confirmError,
  onRefreshPayment
}: OrderConfirmedActionsProps) {
  const t = useTranslations('orderConfirmed.actions');
  const tFooter = useTranslations('orderConfirmed.footer');

  return (
    <Flex direction='column' align='center' gap={6}>
      {showRefreshPayment ? (
        <Button type='button' variant='outline' className='rounded-full' onClick={onRefreshPayment}>
          {t('refreshPaymentStatus')}
        </Button>
      ) : null}

      {confirmError ? (
        <Typography.Muted align='center' className='max-w-md'>
          {confirmError}
        </Typography.Muted>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className='w-full max-w-lg'
      >
        <Flex direction='column' gap={3} className='sm:flex-row'>
          <BackgroundGradient containerClassName='w-full flex-1 rounded-full'>
            <Button asChild size='lg' className='w-full rounded-full'>
              <Link href={`/order-tracking/${orderId}?confirmed=1`}>
                {t('viewOrderDetails')}
                <IconArrowRight className='ml-2 size-4' />
              </Link>
            </Button>
          </BackgroundGradient>

          <Button asChild variant='outline' size='lg' className='w-full flex-1 rounded-full py-2.5'>
            <Link href='/shop'>
              <IconShoppingBag className='mr-2 size-4' />
              {t('continueShopping')}
            </Link>
          </Button>
        </Flex>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className='w-full max-w-md pt-2 text-center'
      >
        <Flex direction='row' align='center' justify='center' gap={3} className='mb-3'>
          <span className='bg-border h-px flex-1' aria-hidden />
          <IconHeart className='text-accent size-4 fill-current' aria-hidden />
          <span className='bg-border h-px flex-1' aria-hidden />
        </Flex>
        <Typography.Muted className='text-sm'>{tFooter('message')}</Typography.Muted>
      </motion.div>
    </Flex>
  );
}
