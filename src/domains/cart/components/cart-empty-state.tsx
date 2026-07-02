'use client';

import { IconArrowRight, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

export function CartEmptyState() {
  const t = useTranslations('cart');

  return (
    <Flex
      direction='column'
      align='center'
      className='bg-card border-border/60 mx-auto max-w-lg rounded-3xl border p-8 text-center shadow-sm sm:p-10'
    >
      <span className='bg-muted mb-5 flex size-16 items-center justify-center rounded-full'>
        <IconShoppingBag className='text-muted-foreground size-8' />
      </span>
      <Typography.H2 family='display' className='text-2xl font-semibold'>
        {t('emptyTitle')}
      </Typography.H2>
      <Typography.Muted className='mt-3 mb-8 max-w-sm text-sm leading-relaxed'>
        {t('emptyDescriptionAlt')}
      </Typography.Muted>
      <Button asChild className='h-12 w-full rounded-full sm:w-auto' size='lg'>
        <Link href='/shop'>
          Explore the shop
          <IconArrowRight className='ms-2 size-4' />
        </Link>
      </Button>
    </Flex>
  );
}
