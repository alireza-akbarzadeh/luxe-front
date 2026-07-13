'use client';

import { IconArrowRight, IconDownload, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { CartImportDialog } from '@/domains/cart/components/cart-import-dialog';

export function CartEmptyState() {
  const t = useTranslations('cart');
  const [importOpen, setImportOpen] = useState(false);

  return (
    <>
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
          {t('emptyDescriptionShared')}
        </Typography.Muted>
        <Flex direction='column' gap={3} className='w-full sm:w-auto sm:flex-row'>
          <Button asChild className='h-12 w-full rounded-full sm:w-auto' size='lg'>
            <Link href='/shop'>
              {t('page.continueShopping')}
              <IconArrowRight className='ms-2 size-4' />
            </Link>
          </Button>
          <Button
            type='button'
            variant='outline'
            className='h-12 w-full rounded-full sm:w-auto'
            size='lg'
            onClick={() => setImportOpen(true)}
          >
            <IconDownload className='me-2 size-4' />
            {t('import.action')}
          </Button>
        </Flex>
      </Flex>
      <CartImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
