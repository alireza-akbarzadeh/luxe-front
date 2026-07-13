'use client';

import {
  IconArrowRight,
  IconDownload,
  IconGift,
  IconHeart,
  IconLayersLinked
} from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { WishlistImportDialog } from '@/domains/wishlist/components/wishlist-import-dialog';

export function WishlistEmptyState() {
  const t = useTranslations('wishlist');
  const [importOpen, setImportOpen] = useState(false);

  return (
    <>
      <Flex
        direction='column'
        align='center'
        className='bg-card border-border/60 mx-auto max-w-xl rounded-3xl border p-8 text-center sm:p-12'
      >
        <span className='bg-muted/60 mb-5 flex size-16 items-center justify-center rounded-full'>
          <IconHeart className='text-muted-foreground size-8' />
        </span>
        <Typography.H2 family='display' className='text-2xl font-semibold'>
          {t('emptyTitle')}
        </Typography.H2>
        <Typography.Muted className='mx-auto mt-3 max-w-md text-sm leading-relaxed'>
          {t('emptyDescription')}
        </Typography.Muted>
        <Flex direction='column' gap={3} className='mt-8 w-full sm:w-auto sm:flex-row'>
          <Button asChild className='h-12 w-full rounded-full sm:w-auto' size='lg'>
            <Link href='/shop'>
              {t('browseShop')}
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
        <Button asChild variant='ghost' className='mt-3 rounded-full'>
          <Link href='/collections'>
            <IconLayersLinked className='me-2 size-4' />
            {t('exploreCollections')}
          </Link>
        </Button>
        <Typography.Muted className='mt-6 text-xs'>
          {t('giftPrompt')}{' '}
          <Link
            href='/gift-cards'
            className='text-accent inline-flex items-center gap-1 font-medium'
          >
            <IconGift className='size-3.5' />
            {t('giftCards')}
          </Link>
        </Typography.Muted>
      </Flex>

      <WishlistImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
