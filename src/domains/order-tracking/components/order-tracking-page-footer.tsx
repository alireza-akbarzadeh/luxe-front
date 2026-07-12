'use client';

import { IconArrowRight, IconHeart } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

/** Closing CTAs for the tracking page. */
export function OrderTrackingPageFooter() {
  const t = useTranslations('orderTracking.page');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='border-border/60 mt-4 border-t pt-10 text-center'
    >
      <Flex direction='row' align='center' justify='center' gap={3} className='mb-4'>
        <span className='bg-border h-px w-16' aria-hidden />
        <IconHeart className='text-accent size-4 fill-current' aria-hidden />
        <span className='bg-border h-px w-16' aria-hidden />
      </Flex>
      <Typography.Text weight='semibold' className='mb-6'>
        {t('thankYou')}
      </Typography.Text>
      <Flex direction='column' gap={3} className='sm:flex-row sm:justify-center'>
        <Button asChild variant='outline' className='rounded-full'>
          <Link href='/shop'>{t('continueShopping')}</Link>
        </Button>
        <Button asChild variant='outline' className='rounded-full'>
          <Link href='/account/orders'>{t('viewAllOrders')}</Link>
        </Button>
        <Button asChild className='rounded-full'>
          <Link href='/contact'>
            {t('contactSupport')}
            <IconArrowRight className='ml-2 size-4' />
          </Link>
        </Button>
      </Flex>
    </motion.div>
  );
}
