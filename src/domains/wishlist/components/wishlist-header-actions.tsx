'use client';

import { IconCheck, IconDownload, IconShare2, IconTrash } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { WishlistImportDialog } from '@/domains/wishlist/components/wishlist-import-dialog';
import { WishlistShareDialog } from '@/domains/wishlist/components/wishlist-share-dialog';
import { useWishlistStore } from '@/domains/wishlist/wishlist.store';

interface WishlistHeaderActionsProps {
  itemLength: number;
  productIds: number[];
  isClearing: boolean;
  onClearAll: () => void;
  showImport?: boolean;
}

export function WishlistHeaderActions({
  itemLength,
  productIds,
  isClearing,
  onClearAll,
  showImport = true
}: Readonly<WishlistHeaderActionsProps>) {
  const t = useTranslations('wishlist');
  const { isCopied, setIsCopied } = useWishlistStore();
  const [shareOpen, setShareOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const handleOpenShare = () => {
    if (productIds.length === 0) return;
    setShareOpen(true);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <div className='flex shrink-0 items-center gap-2'>
        {showImport ? (
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
        ) : null}

        {itemLength > 0 ? (
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={handleOpenShare}
            className='size-10 rounded-full'
            aria-label={t('share.openAria')}
          >
            <AnimatePresence mode='wait' initial={false}>
              {isCopied ? (
                <motion.span
                  key='check'
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <IconCheck className='size-4 text-green-500' />
                </motion.span>
              ) : (
                <motion.span
                  key='share'
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <IconShare2 className='size-4' />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        ) : null}

        {itemLength > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                disabled={isClearing}
                className='text-destructive hover:bg-destructive/10 size-10 rounded-full'
                aria-label={t('clearAllAria')}
              >
                {isClearing ? <Spinner className='size-4' /> : <IconTrash className='size-4' />}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('clearTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('clearDescription', { count: itemLength })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isClearing}>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClearAll}
                  disabled={isClearing || productIds.length === 0}
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                >
                  {isClearing ? t('clearing') : t('clearConfirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>

      <WishlistShareDialog open={shareOpen} onOpenChange={setShareOpen} productIds={productIds} />
      <WishlistImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
