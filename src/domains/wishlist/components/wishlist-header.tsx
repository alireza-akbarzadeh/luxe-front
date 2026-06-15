import { IconCheck, IconChevronRight, IconCopy, IconShare2, IconTrash } from '@tabler/icons-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { copyToClipboard } from '@/lib/utils';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';
import { useWishlistStore } from '~/src/domains/wishlist/wishlist.store';

interface WishlistHeaderProperties {
  itemLength: number;
  productIds: number[];
  isClearing: boolean;
  onClearAll: () => void;
}

export function WishlistHeader(properties: Readonly<WishlistHeaderProperties>) {
  const { itemLength, productIds, isClearing, onClearAll } = properties;
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
        // User cancelled share window or native interface threw error
      }
    } else {
      await copyToClipboard(globalThis.location.href, 'Wishlist link');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  let shareTooltipText = 'Copy wishlist link';
  if (isCopied) {
    shareTooltipText = 'Copied!';
  } else if (isShareSupported) {
    shareTooltipText = 'Share wishlist';
  }

  return (
    <div className='mb-8 space-y-4'>
      <DynamicBreadcrumb
        items={[{ label: 'My Wishlist' }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground text-xs'
        breadcrumbClassName='flex items-center gap-1.5'
      />
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='font-display text-3xl font-semibold tracking-tight md:text-4xl'>
            My Wishlist
          </h1>
          <p className='text-muted-foreground mt-2 text-sm md:text-base'>
            Products you&apos;ve saved with the heart icon — ready when you are.
          </p>
        </div>

        {itemLength > 0 ? (
          <div className='flex items-center gap-3 self-start sm:self-auto'>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={handleShare}
                    className='transform active:scale-95'
                  >
                    <AnimatePresence mode='wait' initial={false}>
                      {isCopied ? (
                        <motion.div
                          key='check'
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                        >
                          <IconCheck className='h-4 w-4 text-green-500' />
                        </motion.div>
                      ) : (
                        <motion.div
                          key='share'
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                        >
                          {isShareSupported ? (
                            <IconShare2 className='h-4 w-4' />
                          ) : (
                            <IconCopy className='h-4 w-4' />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom'>{shareTooltipText}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={isClearing}
                  className='text-destructive hover:bg-destructive/10 hover:text-destructive h-9 gap-2'
                >
                  {isClearing ? <Spinner className='size-4' /> : <IconTrash className='h-4 w-4' />}
                  Clear all
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
        ) : null}
      </div>
    </div>
  );
}
