'use client';

import { IconArrowLeft, IconBasket } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export function CartNotFound() {
  const t = useTranslations('errors.cart');
  const tCommon = useTranslations('errors.common');

  return (
    <div className='bg-background flex min-h-screen flex-row items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center'
      >
        <div className='bg-secondary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <IconBasket className='text-muted-foreground h-10 w-10' />
        </div>
        <h1 className='mb-2 text-3xl font-bold'>{t('emptyTitle')}</h1>
        <p className='text-muted-foreground mb-6 max-w-md'>{t('emptyDescription')}</p>
        <div className='flex items-center justify-center gap-3'>
          <Button asChild variant='outline' className='gap-2 py-4'>
            <Link href='/shop'>
              <IconArrowLeft className='h-4 w-4' />
              {tCommon('goShopping')}
            </Link>
          </Button>
          <Button asChild>
            <Link href='/'>{tCommon('goHome')}</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
