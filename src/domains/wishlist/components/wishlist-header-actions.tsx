'use client';

import { IconCheck, IconCopy, IconShare2, IconTrash } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

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
import { useWishlistStore } from '@/domains/wishlist/wishlist.store';
import { copyToClipboard } from '@/lib/utils';

interface WishlistHeaderActionsProps {
  itemLength: number;
  productIds: number[];
  isClearing: boolean;
  onClearAll: () => void;
}

export function WishlistHeaderActions({
  itemLength,
  productIds,
  isClearing,
  onClearAll
}: Readonly<WishlistHeaderActionsProps>) {
  const { isCopied, setIsCopied } = useWishlistStore();
  const isShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleShare = async () => {
    const shareText = `Check out my wishlist with ${itemLength} items!`;

    if (isShareSupported) {
      try {
        await navigator.share({
          title: 'My Luxe Wishlist',
          text: shareText,
          url: globalThis.location.href
        });
        toast.success('Wishlist shared successfully!');
      } catch {
        // User cancelled share
      }
    } else {
      await copyToClipboard(globalThis.location.href, 'Wishlist link');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const shareLabel = isCopied ? 'Copied' : isShareSupported ? 'Share' : 'Copy link';

  return (
    <div className='flex shrink-0 items-center gap-2'>
      <Button
        variant='outline'
        size='icon'
        onClick={() => void handleShare()}
        className='size-10 rounded-full'
        aria-label={shareLabel}
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
              {isShareSupported ? (
                <IconShare2 className='size-4' />
              ) : (
                <IconCopy className='size-4' />
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            disabled={isClearing}
            className='text-destructive hover:bg-destructive/10 size-10 rounded-full'
            aria-label='Clear all'
          >
            {isClearing ? <Spinner className='size-4' /> : <IconTrash className='size-4' />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear your wishlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes all {itemLength} saved items from your account. You can always save
              products again from the shop.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClearAll}
              disabled={isClearing || productIds.length === 0}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isClearing ? 'Removing…' : 'Clear all items'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
