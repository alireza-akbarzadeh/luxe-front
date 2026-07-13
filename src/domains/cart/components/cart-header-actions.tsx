'use client';

import { IconDownload, IconShare2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CartImportDialog } from '@/domains/cart/components/cart-import-dialog';
import { CartShareDialog } from '@/domains/cart/components/cart-share-dialog';
import type { CartShareSourceItem } from '@/domains/cart/lib/cart-share';

type CartHeaderActionsProps = {
  items: CartShareSourceItem[];
  showShare?: boolean;
  showImport?: boolean;
};

export function CartHeaderActions({
  items,
  showShare = true,
  showImport = true
}: Readonly<CartHeaderActionsProps>) {
  const t = useTranslations('cart');
  const [shareOpen, setShareOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const canShare = showShare && items.length > 0;

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Flex direction='row' align='center' spacing={2} className='shrink-0'>
          {showImport ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='size-10 rounded-full'
                  aria-label={t('import.openAria')}
                  onClick={() => setImportOpen(true)}
                >
                  <IconDownload className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>{t('import.tooltip')}</TooltipContent>
            </Tooltip>
          ) : null}

          {canShare ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='size-10 rounded-full'
                  aria-label={t('share.openAria')}
                  onClick={() => setShareOpen(true)}
                >
                  <IconShare2 className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>{t('share.tooltip')}</TooltipContent>
            </Tooltip>
          ) : null}
        </Flex>
      </TooltipProvider>

      <CartShareDialog open={shareOpen} onOpenChange={setShareOpen} items={items} />
      <CartImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
